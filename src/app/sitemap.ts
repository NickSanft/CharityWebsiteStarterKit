import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/events`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/donate`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/volunteer`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic blog posts
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {}

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic events
  let events: { slug: string; updatedAt: Date }[] = [];
  try {
    events = await prisma.event.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {}

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...eventPages];
}
