import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { KidsBackground } from './KidsBackground';

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('kids-bg min-h-screen bg-kid-bg relative', className)}>
      <KidsBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
