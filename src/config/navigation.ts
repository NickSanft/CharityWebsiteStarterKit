export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export const publicNavItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Blog', href: '/blog' },
  { title: 'Events', href: '/events' },
  { title: 'Volunteer', href: '/volunteer' },
  { title: 'Contact', href: '/contact' },
];

export const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Posts', href: '/admin/posts' },
  { title: 'Events', href: '/admin/events' },
  { title: 'Volunteers', href: '/admin/volunteers' },
  { title: 'Donations', href: '/admin/donations' },
  { title: 'Messages', href: '/admin/messages' },
  { title: 'Settings', href: '/admin/settings' },
];
