import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ glow, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('card p-5', glow && 'glow-purple', className)}
    {...props}
  />
));
Card.displayName = 'Card';
