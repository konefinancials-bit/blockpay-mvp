import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', loading, className, children, disabled, ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' && 'bg-gradient-to-br from-bp-purple to-purple-700 text-white hover:shadow-purple-glow hover:-translate-y-0.5',
        variant === 'secondary' && 'bg-bp-surface border border-bp-border text-white hover:border-bp-purple/50',
        variant === 'outline' && 'border border-bp-purple text-bp-purple hover:bg-bp-purple/10',
        variant === 'ghost' && 'text-bp-text-sec hover:text-white hover:bg-bp-surface',
        variant === 'danger' && 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
        </svg>
      )}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
