export interface Coin {
  id: string;
  name: string;
  symbol: string;
  nowpaymentsCode: string; // code used in NOWPayments API
  coingeckoId: string;
  color: string;
  emoji: string;
  network: string;
}

export const SUPPORTED_COINS: Coin[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', nowpaymentsCode: 'btc', coingeckoId: 'bitcoin', color: '#F7931A', emoji: '₿', network: 'Bitcoin' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', nowpaymentsCode: 'eth', coingeckoId: 'ethereum', color: '#627EEA', emoji: 'Ξ', network: 'ERC-20' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', nowpaymentsCode: 'sol', coingeckoId: 'solana', color: '#9945FF', emoji: '◎', network: 'Solana' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', nowpaymentsCode: 'usdcerc20', coingeckoId: 'usd-coin', color: '#2775CA', emoji: '$', network: 'ERC-20' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', nowpaymentsCode: 'usdterc20', coingeckoId: 'tether', color: '#26A17B', emoji: '₮', network: 'ERC-20' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', nowpaymentsCode: 'matic', coingeckoId: 'matic-network', color: '#8247E5', emoji: '⬡', network: 'Polygon' },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX', nowpaymentsCode: 'avaxc', coingeckoId: 'avalanche-2', color: '#E84142', emoji: '△', network: 'Avalanche' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', nowpaymentsCode: 'bnbbsc', coingeckoId: 'binancecoin', color: '#F3BA2F', emoji: 'B', network: 'BSC' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', nowpaymentsCode: 'doge', coingeckoId: 'dogecoin', color: '#C2A633', emoji: 'Ð', network: 'Dogecoin' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', nowpaymentsCode: 'ltc', coingeckoId: 'litecoin', color: '#BFBBBB', emoji: 'Ł', network: 'Litecoin' },
];

export function getCoin(id: string): Coin | undefined {
  return SUPPORTED_COINS.find((c) => c.id === id || c.symbol.toLowerCase() === id.toLowerCase());
}
