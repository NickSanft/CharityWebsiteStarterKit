import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { publicNavItems } from '@/config/navigation';

interface FooterProps {
  orgName?: string;
  contactEmail?: string;
  contactPhone?: string | null;
  address?: string | null;
  socialLinks?: Record<string, string>;
}

const socialLabels: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter / X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
};

export function Footer({
  orgName = 'OpenGood',
  contactEmail = 'hello@example.com',
  contactPhone,
  address,
  socialLinks = {},
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Heart className="h-5 w-5 text-primary" />
              {orgName}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Making a difference in our community, one step at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {publicNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contactEmail}`} className="hover:text-foreground transition-colors">
                  {contactEmail}
                </a>
              </li>
              {contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contactPhone}`} className="hover:text-foreground transition-colors">
                    {contactPhone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>

            {/* Social Links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const label = socialLabels[platform] || platform;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={label}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {currentYear} {orgName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
