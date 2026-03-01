# 儿童中文故事 App

一个帮助儿童学习中文的网页应用，通过 AI 生成故事、配图和语音朗读，让学习变得更有趣。

## 技术栈

- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **React Router v6** - 路由管理
- **Zustand** - 轻量级状态管理（持久化到 localStorage）
- **Web Speech API** - 浏览器原生语音合成

## 核心功能

1. **故事生成** - 输入关键词，AI 生成中文故事（限制 200 字）
2. **配图生成** - 根据故事内容生成配图
3. **语音朗读** - 支持浏览器 Web Speech API 语音播放
4. **故事书架** - 保存、管理生成的故事
5. **Provider 抽象** - 支持 Mock 和 HTTP 两种提供者模式

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── StoryCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ConfirmDialog.tsx
├── pages/           # 页面组件
│   ├── HomePage.tsx
│   ├── CreateStoryPage.tsx
│   ├── LibraryPage.tsx
│   └── SettingsPage.tsx
├── providers/       # Provider 抽象层
│   ├── LLMProvider.ts
│   ├── MockLLMProvider.ts
│   ├── HttpLLMProvider.ts
│   ├── ImageProvider.ts
│   ├── MockImageProvider.ts
│   ├── HttpImageProvider.ts
│   └── index.ts
├── store/          # Zustand 状态管理
│   ├── storyStore.ts
│   └── settingsStore.ts
├── utils/          # 工具函数
│   └── cn.ts
├── App.tsx         # 主应用组件
└── index.css       # 全局样式
```

## 安装

```bash
pnpm install
```

## 开发

```bash
pnpm dev
```

应用将运行在 http://127.0.0.1:8083

### 开发环境代理配置

Vite 开发服务器已配置代理，用于避免 CORS 问题：

- `/api/anthropic` → `https://coding.dashscope.aliyuncs.com/apps/anthropic`
- `/api/ark` → `https://ark.cn-beijing.volces.com/api/v3`

**本地开发建议使用以下默认 Endpoint（已预填在设置中）：**

- LLM Endpoint: `/api/anthropic/v1/messages`
- Image Endpoint: `/api/ark/images/generations`

这些相对路径会自动通过 Vite proxy 代理到真实 API。

**生产部署注意**：GitHub Pages 等静态托管服务无法使用 Vite proxy。如需在生产环境使用真实 API，必须自行搭建后端代理服务或使用 Serverless（如 Cloudflare Workers、Vercel Functions、阿里云函数计算等），否则会因 CORS 无法调用 API，且 API Key 直接暴露在前端极不安全。

## 构建

```bash
pnpm build
```

## 预览生产构建

```bash
pnpm preview
```

## Provider 配置

### 使用 Mock Provider（默认）

Mock Provider 是开箱即用的，不需要任何配置：

- **MockLLMProvider** - 使用本地模板生成故事
- **MockImageProvider** - 使用 picsum.photos 生成随机图片

### 切换到 HTTP Provider

#### 开发环境（推荐）

1. 进入「设置」页面
2. 取消勾选「使用 Mock」
3. **保持默认 Endpoint 不变**（使用 Vite proxy 代理）：
   - LLM Endpoint: `/api/anthropic/v1/messages`
   - Image Endpoint: `/api/ark/images/generations`
4. 只需填写 Model 和 API Key：
   - LLM Model: `qwen3-max-2026-01-23`
   - LLM API Key: 您的 DashScope API Key
   - Image Model: `doubao-seedream-4-0-250828`
   - Image API Key: 您的火山引擎 ARK API Key

#### 生产环境（需要自建后端代理）

1. 搭建后端代理服务（推荐使用 Serverless）
2. 将 Endpoint 改为您的代理服务地址
3. 填写 Model 和 API Key
4. 确保后端代理正确转发请求到真实 API

### LLM API 配置（Anthropic-compatible Messages API）

支持的 API：
- 阿里云 DashScope: `https://coding.dashscope.aliyuncs.com/apps/anthropic/v1/messages`
- Anthropic: `https://api.anthropic.com/v1/messages`
- 任何兼容 Anthropic Messages API 的服务

**开发环境默认配置（使用代理）：**
- Endpoint: `/api/anthropic/v1/messages`
- Model: `qwen3-max-2026-01-23`
- API Key: 您的 DashScope API Key

必填字段：
- **Endpoint**: API 的完整 URL 或代理路径
- **Model**: 模型名称（如 `qwen3-max-2026-01-23`, `claude-3-sonnet-20240229`）
- **API Key**: 您的 API 密钥

请求格式（Anthropic Messages API）：
```json
{
  "model": "qwen3-max-2026-01-23",
  "max_tokens": 400,
  "messages": [
    {
      "role": "user",
      "content": "请写一个适合儿童的中文小故事..."
    }
  ]
}
```

响应格式：
```json
{
  "id": "...",
  "type": "message",
  "content": [
    {
      "type": "text",
      "text": "从前，月亮和小猫是好朋友..."
    }
  ]
}
```

也兼容简化格式（`data.content`、`data.story`）和 OpenAI 格式（`data.choices[0].message.content`）。

### Image API 配置（OpenAI-compatible Images API）

支持的 API：
- 火山引擎 ARK: `https://ark.cn-beijing.volces.com/api/v3/images/generations`
- OpenAI: `https://api.openai.com/v1/images/generations`
- 任何兼容 OpenAI Images API 的服务

**开发环境默认配置（使用代理）：**
- Endpoint: `/api/ark/images/generations`
- Model: `doubao-seedream-4-0-250828`
- API Key: 您的火山引擎 ARK API Key

必填字段：
- **Endpoint**: API 的完整 URL 或代理路径
- **Model**: 模型名称（如 `doubao-seedream-4-0-250828`, `dall-e-3`）
- **API Key**: 您的 API 密钥

请求格式（OpenAI Images API）：
```json
{
  "model": "doubao-seedream-4-0-250828",
  "prompt": "从前，月亮和小猫是好朋友...",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

响应格式：
```json
{
  "created": 1234567890,
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

也兼容简化格式（`data.imageUrl`）。

### 安全提醒

⚠️ **重要**：API Key 仅保存在浏览器的 localStorage 中，不会提交到 Git 仓库。请勿在代码中硬编码任何 API Key。

如果您使用 Git 进行版本控制，建议在 `.gitignore` 中添加：
```
# 防止意外提交包含敏感信息的文件
.env
.env.local
*.key
```

⚠️ **生产环境安全警告**：
- 静态托管（如 GitHub Pages）无法隐藏 API Key，所有 API Key 都会暴露在前端代码中
- 生产环境必须使用后端代理服务，API Key 应保存在服务器端
- 推荐使用 Serverless（Cloudflare Workers、Vercel Functions、阿里云函数计算等）作为代理层

## 路由说明

- `/` - 首页，应用介绍和入口
- `/create` - 创建故事页，输入关键词生成故事
- `/library` - 故事书架，查看和管理保存的故事
- `/settings` - 设置页，配置 Provider

## 设计风格

采用温馨友好的设计风格：

- **大圆角** - 所有卡片和按钮使用 12px-32px 圆角
- **柔和色彩** - 主色调为温暖的橙黄色系
- **大间距** - 舒适的留白和间距
- **儿童友好** - 大字体、清晰的交互元素

## 数据持久化

所有数据通过 Zustand persist 中间件保存到 localStorage：

- 故事列表（story-storage）
- 用户设置（settings-storage）

---

## 自检清单

### 功能验证

#### 1. 基础功能
- [ ] 首页正常显示，点击「开始创作」跳转到创作页
- [ ] 导航栏在所有页面正常显示，链接可点击

#### 2. 故事生成
- [ ] 输入关键词（如"月亮 小猫 朋友"），点击「生成故事」
- [ ] 生成时显示 loading 状态
- [ ] 生成成功后显示故事卡片，包含：
  - [ ] 关键词标签
  - [ ] 故事内容
  - [ ] 配图（Mock 模式下显示随机图片）
  - [ ] 「语音播放」按钮
  - [ ] 「保存到书架」按钮
- [ ] 故事长度不超过 200 字
- [ ] 不输入关键词时显示错误提示

#### 3. 语音播放
- [ ] 点击「语音播放」按钮，故事被朗读（zh-CN）
- [ ] 按钮状态变为「停止播放」
- [ ] 点击「停止播放」停止朗读
- [ ] 朗读结束自动恢复按钮状态

#### 4. 故事书架
- [ ] 点击「保存到书架」成功保存
- [ ] 进入「书架」页面，显示已保存的故事
- [ ] 每个故事卡片显示关键词、内容、配图
- [ ] 点击「删除」按钮弹出确认弹窗，确认后故事被删除
- [ ] 点击「清空书架」弹出确认弹窗，确认后所有故事被清空
- [ ] 书架空时显示提示和「去创作故事」按钮

#### 5. 设置页面
- [ ] 默认使用 Mock Provider
- [ ] 勾选/取消勾选「使用 Mock」后设置生效
- [ ] LLM Endpoint、Model、Key 输入正常
- [ ] Image Endpoint、Model、Key 输入正常
- [ ] 刷新页面后设置保持（localStorage 持久化）
- [ ] 显示安全提醒和代理说明

#### 6. HTTP Provider（如配置）
- [ ] 取消勾选 Mock，填写 API Endpoint、Model 和 Key
- [ ] 生成故事时调用 HTTP API（开发环境通过代理，无 CORS）
- [ ] API 失败时显示错误提示
- [ ] 配图生成时调用 HTTP API（开发环境通过代理，无 CORS）
- [ ] API 失败时显示错误提示

#### 7. 响应式设计
- [ ] 在手机（375px）上布局正常
- [ ] 在平板（768px）上布局正常
- [ ] 在桌面（1024px+）上布局正常
- [ ] 导航栏在移动端可正常使用

#### 8. 状态管理
- [ ] 刷新页面后故事列表保持
- [ ] 刷新页面后设置保持
- [ ] 清空浏览器数据后数据重置

### 性能检查

- [ ] 首次加载时间 < 3s
- [ ] 故事生成响应时间合理（Mock 模式 < 2s）
- [ ] 页面切换流畅，无明显卡顿

### 兼容性检查

- [ ] Chrome/Edge 最新版本正常工作
- [ ] Firefox 最新版本正常工作
- [ ] Safari 最新版本正常工作

### 代码质量

- [ ] TypeScript 无类型错误
- [ ] ESLint 无警告
- [ ] 代码结构清晰，易于维护

---

## 许可证

ISC
## VPS 部署（中国网络建议）

- 服务端口：**8083**
- 推荐方式：使用 GitHub Actions 通过 SSH 自动拉取并部署到 VPS。
- 依赖安装加速：建议设置 pnpm/npm 镜像源为 `https://registry.npmmirror.com`。
- GitHub 拉取加速（可选）：`https://ghproxy.com/https://github.com/...`

> ⚠️ 安全提醒：生产环境不要在浏览器端直接使用真实 API Key。建议改为服务端代理/Serverless 代管 key。

## 门户集成（/kids 子路径）

如果把本应用挂载到门户网站的子路径（例如 `/kids/`），需要在构建时设置：

```bash
VITE_BASE_PATH=/kids/ pnpm build
```

并确保反向代理把 `/kids/`、以及 `/api/anthropic`、`/api/ark` 转发到本服务。
