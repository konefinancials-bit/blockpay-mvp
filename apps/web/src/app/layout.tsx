import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

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
  twitter: {
    card: 'summary_large_image',
    title: 'BlockPay — Tap to Pay with Crypto',
    description: 'Turn any NFC device into a crypto payment terminal.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
