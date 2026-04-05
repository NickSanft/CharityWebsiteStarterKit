import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeStyle } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'OpenGood — Nonprofit Website Starter Kit',
    template: '%s | OpenGood',
  },
  description: 'A self-hosted website starter kit for charities and nonprofits.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OpenGood',
    title: 'OpenGood — Nonprofit Website Starter Kit',
    description: 'A self-hosted website starter kit for charities and nonprofits.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenGood — Nonprofit Website Starter Kit',
    description: 'A self-hosted website starter kit for charities and nonprofits.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeStyle />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
