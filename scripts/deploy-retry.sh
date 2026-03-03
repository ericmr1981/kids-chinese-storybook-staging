#!/bin/bash
# deploy-retry.sh - GitHub 推送后自动部署到 VPS，带重试和回退机制
# 使用方法：./scripts/deploy-retry.sh

set -e

# ==================== 配置区域 ====================
MAX_RETRIES=3
RETRY_DELAY=5  # 秒

# SSH 配置
SSH_KEY="/Users/ericmr/.ssh/id_ed25519"
VPS_HOST="112.124.18.246"
VPS_USER="root"
VPS_PORT="22"
VPS_PATH="/opt/apps/kids-chinese-storybook"

# 项目配置
FRONTEND_PORT="8084"
BACKEND_PORT="3000"
ENCRYPTION_KEY="12345678901234567890123456789012"
# =================================================

echo "========================================"
echo "  GitHub → VPS 自动部署脚本"
echo "========================================"
echo ""

# 检查 SSH key 是否存在
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key 不存在：$SSH_KEY"
    exit 1
fi

# 检查 GitHub 推送状态
echo "📋 检查本地 Git 状态..."
git_status=$(git status --porcelain)
if [ -n "$git_status" ]; then
    echo "⚠️  检测到未提交的变更："
    echo "$git_status"
    echo ""
    read -p "是否先提交并推送这些变更？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: 自动提交部署前变更"
        git push origin main
    fi
fi

# 确认当前分支
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  当前不在 main 分支（当前：$current_branch）"
    read -p "是否继续部署？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查远程是否有新提交
echo "📡 检查远程仓库..."
git fetch origin main
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
    echo "⚠️  本地落后于远程，先拉取..."
    git pull origin main
fi

echo ""
echo "✅ Git 状态检查通过"
echo ""

# ==================== 部署函数 ====================

deploy_via_ssh() {
    local attempt=$1
    echo "========================================"
    echo "  部署尝试 $attempt / $MAX_RETRIES"
    echo "========================================"
    echo ""

    # 执行部署命令
    ssh -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        -p "$VPS_PORT" \
        "$VPS_USER@$VPS_HOST" "
        set -e

        echo '[1/7] 进入项目目录...'
        cd '$VPS_PATH'

        echo '[2/7] 拉取最新代码...'
        git fetch origin main
        git reset --hard origin/main

        echo '[3/7] 安装依赖...'
        pnpm install --prod

        echo '[4/7] 构建前端...'
        pnpm build

        echo '[5/7] 创建环境配置...'
        mkdir -p backend
        cat > backend/.env << 'EOFENV'
ENCRYPTION_KEY=$ENCRYPTION_KEY
EOFENV

        echo '[6/7] 重启后端服务...'
        killall -9 node 2>/dev/null || true
        cd backend
        nohup npx tsx src/index.ts > /var/log/backend.log 2>&1 &

        echo '[7/7] 验证服务...'
        sleep 5

        # 验证前端
        frontend_code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://localhost:$FRONTEND_PORT || echo '000')

        # 验证后端
        backend_code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://localhost:$BACKEND_PORT/api/settings || echo '000')

        echo ''
        echo '=== 部署验证结果 ==='
        echo \"前端 (端口$FRONTEND_PORT): HTTP \$frontend_code\"
        echo \"后端 (端口$BACKEND_PORT): HTTP \$backend_code\"

        if [ \"\$frontend_code\" = \"200\" ] && [ \"\$backend_code\" = \"200\" ]; then
            echo ''
            echo '✅ 部署成功！'
            echo 'DEPLOY_SUCCESS'
            exit 0
        else
            echo ''
            echo '❌ 部署验证失败'
            echo '后端日志（最后 10 行）：'
            tail -10 /var/log/backend.log 2>/dev/null || echo '无法读取日志'
            echo 'DEPLOY_FAILED'
            exit 1
        fi
    "

    return $?
}

# ==================== 主循环 ====================

retry_count=0
success=false

while [ $retry_count -lt $MAX_RETRIES ]; do
    retry_count=$((retry_count + 1))

    if deploy_via_ssh $retry_count; then
        success=true
        break
    else
        echo ""
        if [ $retry_count -lt $MAX_RETRIES ]; then
            echo "⚠️  第 $retry_count 次部署失败，${RETRY_DELAY}秒后重试..."
            echo ""
            sleep $RETRY_DELAY
        fi
    fi
done

# ==================== 结果处理 ====================

echo ""
echo "========================================"
if [ "$success" = true ]; then
    echo "  ✅ 部署完成！"
    echo "========================================"
    echo ""
    echo "📱 访问地址："
    echo "   http://$VPS_HOST:$FRONTEND_PORT"
    echo ""
    echo "🔍 验证命令："
    echo "   curl http://$VPS_HOST:$FRONTEND_PORT"
    echo "   curl http://$VPS_HOST:$BACKEND_PORT/api/settings"
    exit 0
else
    echo "  ❌ 自动部署失败 $MAX_RETRIES 次"
    echo "========================================"
    echo ""
    echo "🔧 转手动 SSH 部署"
    echo ""
    echo "1️⃣  登录 VPS："
    echo "   ssh -i $SSH_KEY -p $VPS_PORT $VPS_USER@$VPS_HOST"
    echo ""
    echo "2️⃣  执行部署命令："
    echo "   cd $VPS_PATH && git pull && pnpm install && pnpm build"
    echo "   cat > backend/.env << 'EOF'"
    echo "   ENCRYPTION_KEY=$ENCRYPTION_KEY"
    echo "   EOF"
    echo "   killall -9 node && cd backend && nohup npx tsx src/index.ts > /var/log/backend.log 2>&1 &"
    echo ""
    echo "3️⃣  一键执行："
    echo "   ssh -i $SSH_KEY -p $VPS_PORT $VPS_USER@$VPS_HOST \"cd $VPS_PATH && git pull && pnpm install && pnpm build && cat > backend/.env << 'EOF'\\nENCRYPTION_KEY=$ENCRYPTION_KEY\\nEOF\\nkillall -9 node && cd backend && nohup npx tsx src/index.ts > /var/log/backend.log 2>&1 &\""
    echo ""
    exit 1
fi
