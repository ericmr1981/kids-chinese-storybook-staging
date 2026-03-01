import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo / Icon */}
        <div className="text-8xl mb-4">📚</div>

        {/* 标题 */}
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800">
          儿童中文故事
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-neutral-600">
          输入关键词，生成有趣的中文故事，配上精美图片和语音朗读
        </p>

        {/* 特点 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100">
            <div className="text-4xl mb-2">✨</div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">AI 创作故事</h3>
            <p className="text-sm text-neutral-600">智能生成适合儿童的故事</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">精美配图</h3>
            <p className="text-sm text-neutral-600">为故事配上美丽插图</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100">
            <div className="text-4xl mb-2">🔊</div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">语音朗读</h3>
            <p className="text-sm text-neutral-600">标准中文语音播放</p>
          </div>
        </div>

        {/* 开始按钮 */}
        <div className="pt-8">
          <Link to="/create">
            <Button size="lg" className="text-xl px-12 py-4">
              🚀 开始创作
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}