import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm text-bp-text-sec mb-1.5 font-medium">{label}</label>}
    <input
      ref={ref}
      className={clsx(
        'w-full px-4 py-3 rounded-xl bg-bp-surface border text-white placeholder-bp-text-dim focus:outline-none transition-colors text-sm',
        error ? 'border-red-500/60 focus:border-red-500' : 'border-bp-border focus:border-bp-purple',
        className
      )}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
));
Input.displayName = 'Input';
