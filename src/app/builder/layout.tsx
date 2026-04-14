import type { ReactNode } from 'react';

export const metadata = {
  title: 'Charity Website Builder',
  description:
    'Configure a simple website for your charity and download a zip ready for GitHub Pages.',
};

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
