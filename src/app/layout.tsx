import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/lib/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Drinki',
  description: 'Tasting notes and community for whiskey and more',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
