import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { StoryCard } from '../components/StoryCard';
import { PageShell } from '../components/PageShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useStoryStore } from '../store/storyStore';
import type { Story } from '../store/storyStore';

type ConfirmKind = 'none' | { type: 'delete'; storyId: string } | { type: 'clear' };

export function LibraryPage() {
  const { stories, deleteStory, clearStories } = useStoryStore();
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>('none');

  const handleDeleteClick = (storyId: string) => {
    setConfirmKind({ type: 'delete', storyId });
  };

  const handleClearClick = () => {
    setConfirmKind({ type: 'clear' });
  };

  const handleConfirm = () => {
    if (confirmKind !== 'none') {
      if (confirmKind.type === 'delete') {
        deleteStory(confirmKind.storyId);
      } else if (confirmKind.type === 'clear') {
        clearStories();
      }
    }
    setConfirmKind('none');
  };

  const handleCancel = () => {
    setConfirmKind('none');
  };

  return (
    <PageShell>
      <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题和操作 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                ← 返回
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800">
              📚 故事书架
              {stories.length > 0 && (
                <span className="ml-2 text-lg text-neutral-500">
                  ({stories.length})
                </span>
              )}
            </h1>
          </div>

          {stories.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearClick}
            >
              🗑️ 清空书架
            </Button>
          )}
        </div>

        {/* 故事列表 */}
        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-neutral-600 mb-4">书架空空如也</p>
            <Link to="/create">
              <Button size="lg">
                去创作故事
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {stories.map((story: Story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={() => handleDeleteClick(story.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 确认弹窗 */}
      <ConfirmDialog
        open={confirmKind !== 'none'}
        title={
          confirmKind === 'none'
            ? ''
            : confirmKind.type === 'delete'
            ? '删除故事'
            : '清空书架'
        }
        description={
          confirmKind === 'none'
            ? ''
            : confirmKind.type === 'delete'
            ? '确定要删除这个故事吗？删除后无法恢复。'
            : '确定要清空所有故事吗？清空后无法恢复。'
        }
        confirmText={
          confirmKind === 'none'
            ? '确认'
            : confirmKind.type === 'delete'
            ? '删除'
            : '清空'
        }
        danger={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      </div>
    </PageShell>
  );
}