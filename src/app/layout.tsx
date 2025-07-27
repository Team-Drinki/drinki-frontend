import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/lib/react-query-provider';
import { cn } from '@/lib/utils';
import { Navibar } from '@/components/navibar/Navibar';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Drinki',
  description: 'Tasting notes and community for whiskey and more',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideFooterRoutes = ['/login'];

  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex flex-col min-h-screen')}>
        <ReactQueryProvider>
          <Navibar />
          {children}
          {showFooter && <Footer />}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
