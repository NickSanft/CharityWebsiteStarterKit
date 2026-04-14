export type PageKey = 'about' | 'events' | 'volunteer' | 'donate' | 'contact';

export const PAGE_KEYS: PageKey[] = ['about', 'events', 'volunteer', 'donate', 'contact'];

export const PAGE_FILE: Record<PageKey, string> = {
  about: 'about.html',
  events: 'events.html',
  volunteer: 'volunteer.html',
  donate: 'donate.html',
  contact: 'contact.html',
};

export const PAGE_LABEL: Record<PageKey, string> = {
  about: 'About',
  events: 'Events',
  volunteer: 'Volunteer',
  donate: 'Donate',
  contact: 'Contact',
};

export interface BuilderState {
  // Basics
  charity_name: string;
  tagline: string;
  color_primary: string;
  color_accent: string;
  font_family: string;
  logo_data_url: string;
  favicon_data_url: string;

  // Which pages to include (home is always included)
  enabled_pages: Record<PageKey, boolean>;

  // Home page
  home_heading: string;
  home_subheading: string;
  home_body: string;

  // About page
  about_heading: string;
  about_lead: string;
  about_body: string;

  // Events page
  events_heading: string;
  events_lead: string;
  event1_title: string;
  event1_date: string;
  event1_description: string;
  event2_title: string;
  event2_date: string;
  event2_description: string;
  event3_title: string;
  event3_date: string;
  event3_description: string;

  // Volunteer page
  volunteer_heading: string;
  volunteer_lead: string;
  volunteer_body: string;

  // Donate page
  donate_heading: string;
  donate_lead: string;
  donate_body: string;
  stripe_link: string;

  // Contact page
  contact_heading: string;
  contact_lead: string;
  contact_email: string;

  // Socials
  social_twitter: string;
  social_facebook: string;
  social_instagram: string;
}

export const DEFAULTS: BuilderState = {
  charity_name: 'Hope Foundation',
  tagline: 'Building brighter futures, together.',
  color_primary: '#2563eb',
  color_accent: '#f59e0b',
  font_family: 'Inter',
  logo_data_url: '',
  favicon_data_url: '',

  enabled_pages: {
    about: true,
    events: true,
    volunteer: true,
    donate: true,
    contact: true,
  },

  home_heading: 'Welcome to Hope Foundation',
  home_subheading: 'We help communities thrive through volunteering, events, and direct support.',
  home_body:
    'For over a decade we have worked alongside local partners to bring lasting, positive change to the communities we serve. Every donation, every volunteer hour, every shared story moves us closer to our mission.',

  about_heading: 'About us',
  about_lead: 'Our story, our mission, and the people behind the work.',
  about_body:
    'Hope Foundation was founded by a small group of volunteers with a simple belief: that change starts locally. Today we run programs in education, food security, and community health.',

  events_heading: 'Upcoming events',
  events_lead: 'Join us at one of our events to volunteer, learn, or celebrate the work we do.',
  event1_title: 'Annual Community Dinner',
  event1_date: 'Saturday, May 16, 2026',
  event1_description: 'Our largest fundraiser of the year — a community meal with speakers, music, and stories from the people we serve.',
  event2_title: 'Volunteer Orientation',
  event2_date: 'Tuesday, June 2, 2026',
  event2_description: 'New to the Foundation? Come meet the team and learn how you can get involved.',
  event3_title: 'Summer Youth Camp',
  event3_date: 'July 14-18, 2026',
  event3_description: 'A week of outdoor activities, mentorship, and fun for local kids ages 8-14.',

  volunteer_heading: 'Volunteer with us',
  volunteer_lead: 'Give a little time — make a big difference.',
  volunteer_body:
    'We are always looking for volunteers to help with events, outreach, tutoring, and behind-the-scenes work. No experience needed — just enthusiasm.',

  donate_heading: 'Support our work',
  donate_lead: 'Every contribution funds programs in our community.',
  donate_body:
    'Your donation goes directly to supporting our programs. We are a registered non-profit and all contributions are tax-deductible where applicable.',
  stripe_link: 'https://donate.stripe.com/example',

  contact_heading: 'Get in touch',
  contact_lead: 'We would love to hear from you.',
  contact_email: 'hello@example.org',

  social_twitter: '',
  social_facebook: '',
  social_instagram: '',
};
