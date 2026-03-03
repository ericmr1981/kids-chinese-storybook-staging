import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StoryCard } from '../components/StoryCard';
import { SpeakChip } from '../components/SpeakChip';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useStoryStore } from '../store/storyStore';
import { useSettingsStore } from '../store/settingsStore';
import { createLLMProvider, createImageProvider, MockLLMProvider, MockImageProvider } from '../providers';
import { PageShell } from '../components/PageShell';
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

  const derivedKeywords = useMemo(() => {
    return keywords
      .split(/[,，\s]+/)
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 5);
  }, [keywords]);

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

      // 生成故事 - 优先使用 API，失败时回退到 Mock
      let story: string;
      const llmProvider = createLLMProvider(settings);
      try {
        story = await llmProvider.generateStory(keywordArray, 200);
      } catch (llmError) {
        console.warn('LLM API 调用失败，回退到 Mock 模式:', llmError);
        const mockProvider = new MockLLMProvider();
        story = await mockProvider.generateStory(keywordArray, 200);
        setNotice('⚠️ API 不可用，已使用本地模式生成故事');
      }
      story = story.trim();
      if (story.length > 200) story = story.slice(0, 200);

      // 生成图片 - 优先使用 API，失败时回退到 Mock
      let imageUrl: string;
      const imageProvider = createImageProvider(settings);
      try {
        imageUrl = await imageProvider.generateImage(story);
      } catch (imageError) {
        console.warn('图片 API 调用失败，回退到 Mock 模式:', imageError);
        const mockImageProvider = new MockImageProvider();
        imageUrl = await mockImageProvider.generateImage(story);
        if (!notice) {
          setNotice('⚠️ 图片 API 不可用，已使用本地模式生成图片');
        }
      }

      const partial: PartialStory = {
        keywords: keywordArray,
        content: story,
        imageUrl,
      };

      // 先展示
      setGeneratedStory(partial);

      // 自动保存到书架
      addStory(partial);
      if (!notice) {
        setNotice('✅ 已自动保存到书架（可在书架删除/清空）');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
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

          {derivedKeywords.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-neutral-600 mb-2">点击朗读关键词：</div>
              <div className="flex flex-wrap gap-2">
                {derivedKeywords.map((k) => (
                  <SpeakChip key={k} text={k} />
                ))}
              </div>
            </div>
          )}

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
    </PageShell>
  );
}
