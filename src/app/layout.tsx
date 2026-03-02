
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/app-layout';
import ServiceWorkerRegister from '@/app/ServiceWorkerRegister';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';

export const metadata: Metadata = {
  title: 'Phone Point | Premium second hand Phones',
  description: 'Find the best deals on high-quality second hand smartphones. Verified and certified devices.',
};

export const viewport = {
  themeColor: '#050A28',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

// Inline script that runs BEFORE React — catches chunk errors when React itself fails to load
const CHUNK_RECOVERY_SCRIPT = `
(function(){
  var MAX=3;
  function nuke(){
    if('caches' in window){caches.keys().then(function(n){n.forEach(function(c){caches.delete(c)})});}
    if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(w){w.unregister()})});}
  }
  function recover(){
    var a=parseInt(sessionStorage.getItem('_cr')||'0',10);
    if(a<MAX){
      sessionStorage.setItem('_cr',String(a+1));
      nuke();
      window.location.replace(window.location.pathname+'?_v='+Date.now());
    }
  }
  window.addEventListener('error',function(e){
    var m=(e.message||'')+(e.filename||'');
    if(m.indexOf('ChunkLoadError')>-1||m.indexOf('Loading chunk')>-1||(e.filename&&e.filename.indexOf('/_next/')>-1&&m.indexOf('text/html')>-1)){
      recover();
    }
  },true);
  window.addEventListener('unhandledrejection',function(e){
    var m=String(e.reason||'');
    if(m.indexOf('ChunkLoadError')>-1||m.indexOf('Loading chunk')>-1){
      recover();
    }
  },true);
  setTimeout(function(){sessionStorage.removeItem('_cr');},8000);
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CRITICAL: Chunk error recovery runs BEFORE React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: CHUNK_RECOVERY_SCRIPT }} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050A28" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
        <ThemeProvider>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
            <ServiceWorkerRegister />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
