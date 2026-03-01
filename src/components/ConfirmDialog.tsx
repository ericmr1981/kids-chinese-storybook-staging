import { useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // 阻止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" />

      {/* 弹窗 */}
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Card>
          <div className="p-6 space-y-4">
            {/* 标题 */}
            <h2 className="text-xl font-bold text-neutral-800">
              {title}
            </h2>

            {/* 描述 */}
            <p className="text-neutral-600">
              {description}
            </p>

            {/* 按钮 */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant={danger ? 'danger' : 'primary'}
                className="flex-1"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}