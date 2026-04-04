export const siteConfig = {
  name: 'OpenGood',
  description: 'A nonprofit website starter kit built with Next.js',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  defaultLocale: 'en-US',
  donationAmounts: [10, 25, 50, 100],
} as const;
