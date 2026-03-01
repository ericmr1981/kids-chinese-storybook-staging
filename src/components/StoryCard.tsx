import { useState } from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import type { Story } from '../store/storyStore';

interface StoryCardProps {
  story: Story;
  onSave?: () => void;
  onDelete?: () => void;
}

export function StoryCard({ story, onSave, onDelete }: StoryCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported] = useState('speechSynthesis' in window);

  const speak = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(story.content);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9; // 稍慢一点，更适合儿童

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* 图片 */}
        {story.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={story.imageUrl}
              alt="故事配图"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 关键词 */}
        <div className="flex flex-wrap gap-2">
          {story.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>

        {/* 故事内容 */}
        <div className="p-4 bg-neutral-50 rounded-xl">
          <p className="text-lg leading-relaxed text-neutral-800 whitespace-pre-wrap">
            {story.content}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2">
          {speechSupported && (
            <Button
              variant={isSpeaking ? 'danger' : 'secondary'}
              size="sm"
              onClick={speak}
            >
              {isSpeaking ? '⏸️ 停止播放' : '🔊 语音播放'}
            </Button>
          )}
          {onSave && (
            <Button variant="primary" size="sm" onClick={onSave}>
              💾 保存到书架
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              🗑️ 删除
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}