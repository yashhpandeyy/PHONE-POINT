
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/app-layout';
import ServiceWorkerRegister from '@/app/ServiceWorkerRegister';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Phone Point | Premium Refurbished Phones',
  description: 'Find the best deals on high-quality refurbished smartphones. Verified and certified devices.',
};

export const viewport = {
  themeColor: '#050A28',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body bg-background antialiased')}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
          {/* Register SW here */}
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
