import { speak } from '../utils/speak';
import { cn } from '../utils/cn';

export function SpeakChip({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={cn(
        'px-3 py-1 text-sm font-semibold rounded-full',
        'bg-primary-100 text-primary-700',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md hover:brightness-[1.02]',
        'active:translate-y-0 active:scale-[0.98] active:brightness-95',
        'focus:outline-none focus:ring-4 focus:ring-primary-200',
        className
      )}
      aria-label={`朗读：${text}`}
      title="点击朗读"
    >
      {text}
    </button>
  );
}
