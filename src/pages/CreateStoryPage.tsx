import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StoryCard } from '../components/StoryCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoryStore } from '../store/storyStore';
import { useSettingsStore } from '../store/settingsStore';
import { createLLMProvider, createImageProvider } from '../providers';
import type { PartialStory } from '../store/storyStore';
import type { Story } from '../store/storyStore';

export function CreateStoryPage() {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<PartialStory | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const addStory = useStoryStore((state) => state.addStory);
  const settings = useSettingsStore();

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      setError('请输入至少一个关键词');
      return;
    }

    setError('');
    setNotice('');
    setLoading(true);
    setGeneratedStory(null);

    try {
      // 解析关键词（支持逗号、空格分隔）
      const keywordArray = keywords
        .split(/[,，\s]+/)
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 5); // 最多 5 个关键词

      // 生成故事
      const llmProvider = createLLMProvider(settings);
      let story = await llmProvider.generateStory(keywordArray, 200);
      story = story.trim();
      if (story.length > 200) story = story.slice(0, 200);

      // 生成图片
      const imageProvider = createImageProvider(settings);
      const imageUrl = await imageProvider.generateImage(story);

      const partial: PartialStory = {
        keywords: keywordArray,
        content: story,
        imageUrl,
      };

      // 先展示
      setGeneratedStory(partial);

      // 自动保存到书架
      addStory(partial);
      setNotice('✅ 已自动保存到书架（可在书架删除/清空）');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-neutral-800">创作故事</h1>
        </div>

        {/* 输入区域 */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-neutral-100">
          <Input
            label="输入关键词（用空格或逗号分隔）"
            placeholder="例如：月亮 小猫 朋友"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            error={error}
          />
          <div className="mt-4 flex items-center gap-4">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">生成中...</span>
                </>
              ) : (
                '✨ 生成故事'
              )}
            </Button>
          </div>

          {notice && (
            <div className="mt-4 p-3 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary-700 text-sm">
              {notice}
            </div>
          )}
        </div>

        {/* 结果区域 */}
        {generatedStory && <StoryCard story={generatedStory as Story} />}

        {/* 书架链接 */}
        <div className="text-center">
          <Link to="/library">
            <Button variant="ghost">📚 查看故事书架</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
