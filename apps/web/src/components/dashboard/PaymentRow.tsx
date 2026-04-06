import { Payment } from '@/stores/merchant-store';
import { StatusBadge } from '@/components/ui/Badge';
import { getCoin } from '@/lib/coins';

export function PaymentRow({ payment }: { payment: Payment }) {
  const coin = getCoin(payment.payCurrency);
  const date = new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-4 py-3 border-b border-bp-border/50 last:border-0">
      {/* Coin icon */}
      <div className="size-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
        style={{ background: (coin?.color ?? '#6c63ff') + '22', border: `1px solid ${coin?.color ?? '#6c63ff'}44`, color: coin?.color ?? '#6c63ff' }}>
        {coin?.emoji ?? payment.payCurrency.slice(0, 2).toUpperCase()}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{payment.orderId}</div>
        <div className="text-xs text-bp-text-dim">{date}</div>
      </div>

      {/* Crypto amount */}
      <div className="text-right shrink-0">
        <div className="text-sm font-bold">{payment.payAmount} {payment.payCurrency.toUpperCase()}</div>
        <div className="text-xs text-bp-text-dim">${payment.priceAmount.toFixed(2)}</div>
      </div>

      <StatusBadge status={payment.status} />
    </div>
  );
}
