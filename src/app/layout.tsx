import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/lib/react-query-provider';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import { Navibar } from '@/components/navibar/navibar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Drinki',
  description: 'Tasting notes and community for whiskey and more',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex flex-col min-h-screen')}>
        <ReactQueryProvider>
          <Navibar />
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
