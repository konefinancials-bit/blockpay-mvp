import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ label, value, change, positive, icon: Icon, iconColor = 'text-bp-purple' }: StatsCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-bp-text-sec">{label}</span>
        <div className={clsx('size-9 rounded-xl bg-bp-bg flex items-center justify-center', iconColor)}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="text-2xl font-black mb-1">{value}</div>
      {change && (
        <div className={clsx('text-xs font-medium', positive ? 'text-green-400' : 'text-red-400')}>
          {positive ? '↑' : '↓'} {change} vs yesterday
        </div>
      )}
    </div>
  );
}
