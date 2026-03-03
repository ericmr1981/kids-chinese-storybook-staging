import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useSettingsStore } from '../store/settingsStore';
import { PageShell } from '../components/PageShell';

export function SettingsPage() {
  const settings = useSettingsStore();

  return (
    <PageShell>
      <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 标题和返回 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                ← 返回
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800">⚙️ 设置</h1>
          </div>
          {/* 保存状态指示器 */}
          <div className="text-sm">
            {settings.saveStatus === 'saving' && (
              <span className="text-neutral-500">💾 保存中...</span>
            )}
            {settings.saveStatus === 'saved' && (
              <span className="text-green-600">✓ 已保存</span>
            )}
            {settings.saveStatus === 'error' && (
              <span className="text-red-500" title={settings.saveError || ''}>
                ✕ 保存失败
              </span>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">本地配置文件模式</h2>
          <p className="text-sm text-neutral-700">
            当前不再通过网页保存 API Key，也不再自动回退到 Mock。
          </p>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 space-y-2">
            <p>请直接在服务器上编辑 <code className="bg-neutral-200 px-1 rounded">backend/local-config.json</code>。</p>
            <p>LLM Endpoint: <code className="bg-neutral-200 px-1 rounded">{settings.llmEndpoint}</code></p>
            <p>LLM Model: <code className="bg-neutral-200 px-1 rounded">{settings.llmModel}</code></p>
            <p>Image Endpoint: <code className="bg-neutral-200 px-1 rounded">{settings.imageEndpoint}</code></p>
            <p>Image Model: <code className="bg-neutral-200 px-1 rounded">{settings.imageModel}</code></p>
          </div>
        </div>

        <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-xl space-y-3">
          <p className="text-sm text-secondary-700">
            💡 提示：密钥只保存在服务器本地文件中，不再经过浏览器存储或网页表单提交
          </p>
          <p className="text-sm text-green-600">
            🔒 安全提醒：请把 <code className="bg-neutral-200 px-1 rounded">backend/local-config.json</code> 加入服务器部署目录，但不要提交到 Git
          </p>
          <p className="text-sm text-neutral-700">
            示例文件：<code className="bg-neutral-200 px-1 rounded">backend/local-config.example.json</code>
          </p>
          <p className="text-sm text-neutral-700">
            修改本地配置后，重启后端服务即可生效。
          </p>
        </div>
      </div>
      </div>
    </PageShell>
  );
}
