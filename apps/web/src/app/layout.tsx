import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], weight: ['400','500','700','800'], variable: '--font-syne', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-dm', display: 'swap', axes: ['opsz'] });

export const metadata: Metadata = {
  title: 'BlockPay — Tap to Pay with Crypto',
  description: 'NFC tap-to-pay crypto payment infrastructure. Non-custodial, 50+ coins, live FX. No app required for customers.',
  keywords: 'crypto payments, NFC, tap to pay, bitcoin, ethereum, merchant, point of sale',
  openGraph: {
    title: 'BlockPay — Tap to Pay with Crypto',
    description: 'Turn any NFC device into a crypto payment terminal.',
    url: 'https://blockpay.live',
    siteName: 'BlockPay',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20height%3D%2232%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%227%22%20fill%3D%22%23080808%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2227%22%20r%3D%222.4%22%20fill%3D%22%23c8f135%22%2F%3E%3Cpath%20d%3D%22M%2010.8%2C22.2%20Q%2016%2C15.8%2021.2%2C22.2%22%20fill%3D%22none%22%20stroke%3D%22%23c8f135%22%20stroke-width%3D%222.2%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M%206.6%2C17.4%20Q%2016%2C7.8%2025.4%2C17.4%22%20fill%3D%22none%22%20stroke%3D%22%23c8f135%22%20stroke-width%3D%222.0%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.60%22%2F%3E%3Cpath%20d%3D%22M%202.6%2C12.8%20Q%2016%2C0%2029.4%2C12.8%22%20fill%3D%22none%22%20stroke%3D%22%23c8f135%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.28%22%2F%3E%3C%2Fsvg%3E" />
      </head>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
