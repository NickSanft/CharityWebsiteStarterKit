import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Charity Website Builder',
  description:
    'Build a simple charity website and download it as a zip ready for GitHub Pages.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
