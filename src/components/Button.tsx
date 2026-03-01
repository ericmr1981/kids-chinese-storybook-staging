import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variants
          variant === 'primary' && [
            'bg-primary-500 text-white',
            'hover:bg-primary-600',
            'active:bg-primary-700',
            'shadow-md hover:shadow-lg',
          ],
          variant === 'secondary' && [
            'bg-secondary-100 text-secondary-700',
            'hover:bg-secondary-200',
            'active:bg-secondary-300',
          ],
          variant === 'danger' && [
            'bg-red-500 text-white',
            'hover:bg-red-600',
            'active:bg-red-700',
          ],
          variant === 'ghost' && [
            'bg-transparent text-neutral-600',
            'hover:bg-neutral-100',
            'active:bg-neutral-200',
          ],
          // Sizes
          size === 'sm' && 'h-8 px-3 text-sm rounded-lg',
          size === 'md' && 'h-10 px-4 text-base rounded-xl',
          size === 'lg' && 'h-12 px-6 text-lg rounded-2xl',
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