import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from '@/components/ui/sonner';
import AppWrapper from './AppWrapper';

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
          <SessionProvider>
            <AppWrapper>{children}</AppWrapper>
            <Toaster position="top-center" richColors />
          </SessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
