import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  } catch {
    // Database not ready
  }

  const socialLinks = (settings?.socialLinks as Record<string, string>) || {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        orgName={settings?.orgName}
        logoUrl={settings?.logoUrl}
      />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer
        orgName={settings?.orgName}
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
        address={settings?.address}
        socialLinks={socialLinks}
      />
    </div>
  );
}
