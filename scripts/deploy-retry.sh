#!/bin/bash
# deploy-retry.sh - GitHub 推送后自动部署到 VPS，带重试和回退机制
# 使用方法：./scripts/deploy-retry.sh

set -e

# ==================== 配置区域 ====================
MAX_RETRIES=3
RETRY_DELAY=5  # 秒

# SSH 配置
VPS_HOST="112.124.18.246"
VPS_USER="root"
VPS_PORT="22"
VPS_PATH="/opt/apps/kids-chinese-storybook"
VPS_PASSWORD="${VPS_PASSWORD:-}"

# 项目配置
FRONTEND_PORT="8084"
BACKEND_PORT="3000"
ENCRYPTION_KEY="12345678901234567890123456789012"
# =================================================

echo "========================================"
echo "  GitHub → VPS 自动部署脚本"
echo "========================================"
echo ""

# 检查 sshpass 是否存在
if ! command -v sshpass >/dev/null 2>&1; then
    echo "❌ 缺少 sshpass，请先安装：brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

# 读取 VPS 密码（优先使用环境变量，避免写入脚本）
if [ -z "$VPS_PASSWORD" ]; then
    read -s -p "请输入 VPS 密码: " VPS_PASSWORD
    echo
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
    sshpass -p "$VPS_PASSWORD" ssh \
        -o StrictHostKeyChecking=no \
        -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
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
        llm_proxy_code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST http://localhost:$BACKEND_PORT/api/anthropic/v1/messages -H 'content-type: application/json' -d '{}' || echo '000')
        image_proxy_code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST http://localhost:$BACKEND_PORT/api/ark/images/generations -H 'content-type: application/json' -d '{}' || echo '000')

        echo ''
        echo '=== 部署验证结果 ==='
        echo \"前端 (端口$FRONTEND_PORT): HTTP \$frontend_code\"
        echo \"后端 (端口$BACKEND_PORT): HTTP \$backend_code\"
        echo \"LLM 代理 (/api/anthropic): HTTP \$llm_proxy_code\"
        echo \"图片代理 (/api/ark): HTTP \$image_proxy_code\"

        if [ \"\$frontend_code\" = \"200\" ] && [ \"\$backend_code\" = \"200\" ] && [ \"\$llm_proxy_code\" != \"404\" ] && [ \"\$llm_proxy_code\" != \"000\" ] && [ \"\$image_proxy_code\" != \"404\" ] && [ \"\$image_proxy_code\" != \"000\" ]; then
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
    echo "   ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p $VPS_PORT $VPS_USER@$VPS_HOST"
    echo ""
    echo "2️⃣  执行部署命令："
    echo "   cd $VPS_PATH && git pull && pnpm install && pnpm build"
    echo "   cat > backend/.env << 'EOF'"
    echo "   ENCRYPTION_KEY=$ENCRYPTION_KEY"
    echo "   EOF"
    echo "   killall -9 node && cd backend && nohup npx tsx src/index.ts > /var/log/backend.log 2>&1 &"
    echo ""
    echo "3️⃣  一键执行："
    echo "   export VPS_PASSWORD='你的密码' && ./scripts/deploy-retry.sh"
    echo ""
    exit 1
fi
