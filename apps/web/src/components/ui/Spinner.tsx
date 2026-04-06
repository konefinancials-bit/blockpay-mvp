export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={`animate-spin text-bp-purple ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
    </svg>
  );
}
