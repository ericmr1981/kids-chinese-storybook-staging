import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'kidPink' | 'kidBlue';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-kid-bg',
          // Tactile feel (hover/active)
          'hover:-translate-y-0.5 hover:shadow-lg hover:brightness-[1.02]',
          'active:translate-y-0 active:scale-[0.98] active:brightness-95',
          // Variants
          variant === 'primary' && [
            'bg-primary-500 text-white',
            'hover:bg-primary-600 active:bg-primary-700',
            'shadow-md',
            'focus:ring-primary-200',
          ],
          variant === 'secondary' && [
            'bg-secondary-100 text-secondary-700',
            'hover:bg-secondary-200 active:bg-secondary-300',
            'shadow-sm',
            'focus:ring-secondary-200',
          ],
          variant === 'danger' && [
            'bg-red-500 text-white',
            'hover:bg-red-600 active:bg-red-700',
            'shadow-sm',
            'focus:ring-red-200',
          ],
          variant === 'ghost' && [
            'bg-transparent text-neutral-700',
            'hover:bg-neutral-100 active:bg-neutral-200',
            'shadow-none hover:shadow-md',
            'focus:ring-neutral-200',
          ],
          variant === 'kidPink' && [
            'bg-kid-pink-500 text-white',
            'hover:bg-kid-pink-600',
            'shadow-card',
            'focus:ring-kid-pink-500/25',
          ],
          variant === 'kidBlue' && [
            'bg-kid-blue-500 text-white',
            'hover:bg-kid-blue-600',
            'shadow-card',
            'focus:ring-kid-blue-500/25',
          ],
          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm rounded-xl',
          size === 'md' && 'h-11 px-5 text-base rounded-2xl',
          size === 'lg' && 'h-12 px-7 text-lg rounded-2xl',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
