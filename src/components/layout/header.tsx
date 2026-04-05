'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publicNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  orgName?: string;
  logoUrl?: string | null;
}

export function Header({ orgName = 'OpenGood', logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          {logoUrl ? (
            <img src={logoUrl} alt={orgName} className="h-8 w-auto" />
          ) : (
            <Heart className="h-6 w-6 text-primary" />
          )}
          <span>{orgName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
          <Button asChild>
            <Link href="/donate">
              <Heart className="mr-2 h-4 w-4" />
              Donate
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav role="navigation" aria-label="Mobile navigation" className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="mr-2 h-4 w-4" />
                Donate
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
