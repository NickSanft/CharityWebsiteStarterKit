import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      orgName: 'Greenfield Community Foundation',
      tagline: 'Building stronger communities together',
      primaryColor: '#2563eb',
      secondaryColor: '#16a34a',
      contactEmail: 'hello@greenfield.org',
      contactPhone: '(555) 123-4567',
      address: '123 Main Street, Greenfield, CA 90210',
      socialLinks: {
        facebook: 'https://facebook.com/greenfield',
        twitter: 'https://twitter.com/greenfield',
        instagram: 'https://instagram.com/greenfield',
        linkedin: 'https://linkedin.com/company/greenfield',
      },
      volunteerInterests: [
        'Fundraising',
        'Mentoring',
        'Event Support',
        'Administrative',
        'Technical',
        'Community Outreach',
        'Youth Programs',
      ],
    },
  });

  // Create admin user (password: "admin123")
  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greenfield.org' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@greenfield.org',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // Create editor user (password: "editor123")
  const editorHash = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@greenfield.org' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      email: 'editor@greenfield.org',
      passwordHash: editorHash,
      role: 'EDITOR',
    },
  });

  // Create blog posts
  const posts = [
    {
      title: 'Annual Charity Gala Raises Record Funds',
      slug: 'annual-charity-gala-raises-record-funds',
      excerpt: 'Our annual gala exceeded all expectations, raising over $50,000 for local programs and services.',
      content: `# Annual Charity Gala Raises Record Funds

Our annual charity gala was a tremendous success this year! We are thrilled to announce that the event raised over **$50,000** for local programs and services.

## Event Highlights

- Over 300 guests attended the evening event
- Silent auction featured 50+ items donated by local businesses
- Live music by the Greenfield Community Orchestra
- Keynote speech by Mayor Jane Smith

## How the Funds Will Be Used

The funds raised will support:

1. **Youth Education Programs** — After-school tutoring and mentorship
2. **Community Garden Initiative** — Expanding our network of community gardens
3. **Senior Support Services** — Meal delivery and companion visits
4. **Emergency Relief Fund** — Supporting families in crisis

Thank you to all who attended, donated, and volunteered. Together, we are making Greenfield a better place for everyone.`,
      coverImage: null,
      published: true,
      publishedAt: new Date('2024-03-15'),
      authorId: admin.id,
      tags: JSON.stringify(['gala', 'fundraising', 'community']),
    },
    {
      title: 'New Community Garden Opens in Riverside Park',
      slug: 'new-community-garden-opens-riverside-park',
      excerpt: 'The newest addition to our community garden network is now open for local residents to join.',
      content: `# New Community Garden Opens in Riverside Park

We are excited to announce the opening of our newest community garden, located in the heart of Riverside Park!

## About the Garden

The Riverside Community Garden features:

- **30 individual plots** available for local residents
- Shared tool shed and composting area
- Accessible raised beds for gardeners with mobility challenges
- A children's learning garden for school field trips

## How to Get Involved

Interested in claiming a plot? Here's how:

1. Visit our [volunteer page](/volunteer) to sign up
2. Attend the new gardener orientation (held monthly)
3. Start growing!

Plot fees are $25/season, with fee waivers available for those in need.

> "Gardens are not made by singing 'Oh, how beautiful,' and sitting in the shade." — Rudyard Kipling`,
      coverImage: null,
      published: true,
      publishedAt: new Date('2024-03-10'),
      authorId: editor.id,
      tags: JSON.stringify(['garden', 'community', 'environment']),
    },
    {
      title: 'Volunteer Spotlight: Meet Maria Garcia',
      slug: 'volunteer-spotlight-maria-garcia',
      excerpt: 'Maria has been volunteering with us for over 5 years. Learn about her incredible journey and impact.',
      content: `# Volunteer Spotlight: Meet Maria Garcia

This month, we're shining a light on one of our most dedicated volunteers — **Maria Garcia**.

## Maria's Story

Maria first joined Greenfield Community Foundation as a volunteer in 2019. What started as helping out at weekend food drives has turned into a full commitment to community service.

"I moved to Greenfield not knowing anyone," Maria shares. "Volunteering helped me build connections and find my purpose."

## Her Impact

Over the past 5 years, Maria has:

- Organized **200+ meals** through our senior meal delivery program
- Mentored **15 students** in our youth education initiative
- Led the planning committee for three annual galas
- Recruited **30 new volunteers** to the organization

## Want to Follow Maria's Lead?

We're always looking for passionate people to join our team. [Sign up to volunteer](/volunteer) and start making a difference today!`,
      coverImage: null,
      published: true,
      publishedAt: new Date('2024-03-05'),
      authorId: admin.id,
      tags: JSON.stringify(['volunteer', 'spotlight', 'community']),
    },
    {
      title: 'Summer Camp Registration Now Open',
      slug: 'summer-camp-registration-now-open',
      excerpt: 'Register your kids for our popular summer camp program featuring outdoor activities, arts, and STEM workshops.',
      content: `# Summer Camp Registration Now Open

Get ready for an unforgettable summer! Registration is now open for the Greenfield Summer Camp 2024.

## Camp Details

- **Dates:** June 17 — August 9, 2024
- **Ages:** 6-14 years old
- **Location:** Greenfield Community Center
- **Hours:** 8:00 AM — 4:00 PM

## Activities Include

- Nature hikes and outdoor exploration
- Arts and crafts workshops
- STEM experiments and robotics
- Swimming and water sports
- Team building games
- Weekly field trips

## Pricing

| Session | Early Bird | Regular |
|---------|-----------|---------|
| 1 Week  | $150      | $200    |
| 4 Weeks | $500      | $700    |
| Full Summer | $900 | $1,200  |

*Scholarships available — no child turned away for inability to pay.*

Register at our upcoming events or [contact us](/contact) for more information.`,
      coverImage: null,
      published: true,
      publishedAt: new Date('2024-02-28'),
      authorId: editor.id,
      tags: JSON.stringify(['summer camp', 'youth', 'activities']),
    },
    {
      title: 'Draft: Year in Review 2024',
      slug: 'year-in-review-2024',
      excerpt: 'A look back at everything we accomplished together in 2024.',
      content: '# Year in Review 2024\n\n*Draft — to be published in December.*\n\nThis is a draft post.',
      coverImage: null,
      published: false,
      publishedAt: null,
      authorId: admin.id,
      tags: JSON.stringify(['annual report']),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // Create sample events
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const events = [
    {
      title: 'Spring Fundraiser Dinner',
      slug: 'spring-fundraiser-dinner',
      description: 'Join us for an evening of fine dining, live music, and fundraising for our community programs. All proceeds support youth education and senior services.',
      location: '456 Oak Avenue, Greenfield, CA 90210',
      startDate: nextMonth,
      endDate: new Date(nextMonth.getTime() + 4 * 60 * 60 * 1000),
      capacity: 200,
      published: true,
    },
    {
      title: 'Community Cleanup Day',
      slug: 'community-cleanup-day',
      description: 'Help us beautify our neighborhoods! Gloves, bags, and refreshments provided. Bring the whole family!',
      location: 'Riverside Park, Greenfield',
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000),
      capacity: null,
      published: true,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  // Create sample volunteers
  const volunteers = [
    {
      name: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '(555) 234-5678',
      interests: JSON.stringify(['mentoring', 'events', 'fundraising']),
      availability: 'Weekends and Wednesday evenings',
      status: 'ACTIVE' as const,
    },
    {
      name: 'James Wilson',
      email: 'james@example.com',
      phone: '(555) 345-6789',
      interests: JSON.stringify(['technical', 'administrative']),
      availability: 'Flexible schedule',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Emily Chen',
      email: 'emily@example.com',
      interests: JSON.stringify(['events', 'mentoring']),
      availability: 'Saturday mornings',
      status: 'NEW' as const,
    },
    {
      name: 'Robert Brown',
      email: 'robert@example.com',
      phone: '(555) 456-7890',
      interests: JSON.stringify(['fundraising']),
      status: 'CONTACTED' as const,
    },
  ];

  for (const volunteer of volunteers) {
    await prisma.volunteer.upsert({
      where: { email: volunteer.email },
      update: {},
      create: volunteer,
    });
  }

  // Create sample donations
  const donations = [
    {
      stripePaymentId: 'pi_demo_001',
      amount: 5000,
      donorName: 'Anonymous',
      donorEmail: 'donor1@example.com',
      recurring: false,
      status: 'COMPLETED' as const,
      createdAt: new Date('2024-03-14'),
    },
    {
      stripePaymentId: 'pi_demo_002',
      amount: 2500,
      donorName: 'John Doe',
      donorEmail: 'john@example.com',
      recurring: true,
      status: 'COMPLETED' as const,
      createdAt: new Date('2024-03-10'),
    },
    {
      stripePaymentId: 'pi_demo_003',
      amount: 10000,
      donorName: 'Jane Smith',
      donorEmail: 'jane@example.com',
      message: 'In memory of my grandmother',
      recurring: false,
      status: 'COMPLETED' as const,
      createdAt: new Date('2024-03-01'),
    },
    {
      stripePaymentId: 'pi_demo_004',
      amount: 1000,
      donorEmail: 'supporter@example.com',
      recurring: true,
      status: 'COMPLETED' as const,
      createdAt: new Date('2024-02-15'),
    },
  ];

  for (const donation of donations) {
    await prisma.donation.upsert({
      where: { stripePaymentId: donation.stripePaymentId },
      update: {},
      create: donation,
    });
  }

  // Create sample contact submissions
  const contacts = [
    {
      name: 'Alex Thompson',
      email: 'alex@example.com',
      subject: 'Interested in corporate sponsorship',
      message: 'Hi, our company would like to explore sponsorship opportunities for your upcoming events. Please let us know how we can get involved.',
      read: false,
    },
    {
      name: 'Lisa Park',
      email: 'lisa@example.com',
      subject: 'Question about volunteer hours',
      message: 'I need to complete 40 hours of community service for my university. Can you help me find suitable volunteer opportunities?',
      read: true,
    },
  ];

  for (const contact of contacts) {
    await prisma.contactSubmission.create({ data: contact });
  }

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@greenfield.org / admin123');
  console.log('Editor login: editor@greenfield.org / editor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
