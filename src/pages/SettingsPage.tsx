import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useSettingsStore } from '../store/settingsStore';

export function SettingsPage() {
  const settings = useSettingsStore();

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 标题和返回 */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              ← 返回
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800">⚙️ 设置</h1>
        </div>

        {/* LLM 设置 */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            LLM 故事生成设置
          </h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.useMockLLM}
                onChange={(e) => settings.setUseMockLLM(e.target.checked)}
                className="w-5 h-5 rounded-md text-primary-500 focus:ring-primary-400"
              />
              <span className="text-neutral-700">使用 Mock（本地生成）</span>
            </label>
          </div>

          {!settings.useMockLLM && (
            <div className="space-y-4 pt-2">
              <Input
                label="LLM API Endpoint"
                placeholder="/api/anthropic/v1/messages"
                value={settings.llmEndpoint}
                onChange={(e) => settings.setLLMEndpoint(e.target.value)}
              />
              <Input
                label="Model"
                placeholder="qwen3-max-2026-01-23"
                value={settings.llmModel}
                onChange={(e) => settings.setLLMModel(e.target.value)}
              />
              <Input
                label="API Key"
                type="password"
                placeholder="sk-..."
                value={settings.llmKey}
                onChange={(e) => settings.setLLMKey(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 图片生成设置 */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            图片生成设置
          </h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.useMockImage}
                onChange={(e) => settings.setUseMockImage(e.target.checked)}
                className="w-5 h-5 rounded-md text-primary-500 focus:ring-primary-400"
              />
              <span className="text-neutral-700">使用 Mock（随机图片）</span>
            </label>
          </div>

          {!settings.useMockImage && (
            <div className="space-y-4 pt-2">
              <Input
                label="Image API Endpoint"
                placeholder="/api/ark/images/generations"
                value={settings.imageEndpoint}
                onChange={(e) => settings.setImageEndpoint(e.target.value)}
              />
              <Input
                label="Model"
                placeholder="dall-e-3"
                value={settings.imageModel}
                onChange={(e) => settings.setImageModel(e.target.value)}
              />
              <Input
                label="API Key"
                type="password"
                placeholder="sk-..."
                value={settings.imageKey}
                onChange={(e) => settings.setImageKey(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 提示信息 */}
        <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-xl space-y-3">
          <p className="text-sm text-secondary-700">
            💡 提示：所有设置会自动保存到浏览器本地存储
          </p>
          <p className="text-sm text-red-600">
            ⚠️ 安全提醒：API Key 仅保存在浏览器本地，不会提交到 Git 仓库
          </p>
          <p className="text-sm text-neutral-700">
            🔧 开发环境代理：
            <br />
            • LLM Endpoint 默认使用 <code className="bg-neutral-200 px-1 rounded">/api/anthropic/v1/messages</code>
            <br />
            • Image Endpoint 默认使用 <code className="bg-neutral-200 px-1 rounded">/api/ark/images/generations</code>
            <br />
            这些路径会通过 Vite proxy 代理到真实 API，避免 CORS 问题
          </p>
          <p className="text-sm text-orange-600">
            ⚠️ 生产部署注意：GitHub Pages 等静态托管无法使用 Vite proxy，需要自行搭建后端代理或 Serverless，否则会因 CORS 无法调用 API 且 API Key 不安全
          </p>
        </div>
      </div>
    </div>
  );
}