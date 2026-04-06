export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatCrypto(amount: number, symbol: string): string {
  const formatted = amount.toFixed(8).replace(/\.?0+$/, '');
  return `${formatted} ${symbol.toUpperCase()}`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address || address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    waiting: '#ffb300',
    confirming: '#00e5ff',
    confirmed: '#00e676',
    finished: '#00e676',
    sending: '#00e5ff',
    partially_paid: '#ff9800',
    failed: '#ff5252',
    refunded: '#ff5252',
    expired: '#606070',
  };
  return map[status] ?? '#606070';
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
