import { clsx } from 'clsx';

type Status = 'waiting' | 'confirming' | 'confirmed' | 'finished' | 'failed' | 'expired' | 'sending' | 'partially_paid';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  waiting: { label: 'Waiting', className: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  confirming: { label: 'Confirming', className: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  confirmed: { label: 'Confirmed', className: 'bg-green-500/10 border-green-500/30 text-green-400' },
  finished: { label: 'Finished', className: 'bg-green-500/10 border-green-500/30 text-green-400' },
  sending: { label: 'Sending', className: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  partially_paid: { label: 'Partial', className: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  failed: { label: 'Failed', className: 'bg-red-500/10 border-red-500/30 text-red-400' },
  expired: { label: 'Expired', className: 'bg-gray-500/10 border-gray-500/30 text-gray-400' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };
  return (
    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', cfg.className)}>
      {cfg.label}
    </span>
  );
}

function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
