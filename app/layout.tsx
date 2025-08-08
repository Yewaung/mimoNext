import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

// Optimize font loading
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mimo Task Manager',
  description: 'A lightweight local storage task board with modern design',
  keywords: ['task manager', 'productivity', 'local storage', 'tasks', 'todo'],
  authors: [{ name: 'Mimo' }],
  creator: 'Mimo',
  publisher: 'Mimo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mimo-task-manager.vercel.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mimo-task-manager.vercel.app',
    title: 'Mimo Task Manager',
    description: 'A lightweight local storage task board with modern design',
    siteName: 'Mimo Task Manager',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mimo Task Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mimo Task Manager',
    description: 'A lightweight local storage task board with modern design',
    images: ['/twitter-image.png'],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0FF0FC' },
    { media: '(prefers-color-scheme: dark)', color: '#0FF0FC' },
  ],
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {/* Background gradient */}
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />

        {/* Animated background elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-secondary/10 blur-3xl"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10">{children}</div>

        {/* Global toast container would go here if using react-hot-toast */}
      </body>
    </html>
  );
}
