import Link from 'next/link';
import { Heart, Globe, Users, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { formatDate, truncate } from '@/lib/utils';
import { DonationWidget } from '@/components/donations/donation-widget';
import { DonationTicker } from '@/components/donations/donation-ticker';

export const dynamic = 'force-dynamic';

interface PostWithAuthor {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string };
}

async function getLatestPosts(): Promise<PostWithAuthor[]> {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { author: { select: { name: true } } },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-24 text-primary-foreground md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Together, We Can Make a Difference
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            We are dedicated to creating positive change in our community through
            compassion, collaboration, and action. Join us in building a brighter
            future for everyone.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/volunteer">
                <Users className="mr-2 h-5 w-5" />
                Get Involved
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission / Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why We Do What We Do
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every day, we work toward a world where opportunity and support are
              available to all. Here is how we are making it happen.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="mt-4 text-xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We empower communities by providing resources, education, and
                  support to those who need it most. Our programs are designed to
                  create lasting, sustainable change.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="mt-4 text-xl">Our Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Through the generosity of our donors and volunteers, we have
                  reached thousands of individuals and families, improving lives
                  and strengthening communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="mt-4 text-xl">Get Involved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Whether you volunteer your time, make a donation, or simply
                  spread the word, every action counts. Join our community of
                  change-makers today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Latest News
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stay up to date with our latest stories, events, and announcements.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col">
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt
                        ? formatDate(post.publishedAt)
                        : formatDate(post.createdAt)}
                    </div>
                    <CardTitle className="text-lg">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {post.excerpt
                        ? truncate(post.excerpt, 150)
                        : truncate(post.content, 150)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="px-0" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <Card className="mx-auto max-w-md p-8">
                <p className="text-muted-foreground">
                  No news posts yet. Check back soon for updates on our work and
                  impact.
                </p>
              </Card>
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <DonationWidget />
            <DonationTicker />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to Make a Difference?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Your support enables us to continue our mission. Whether through
                a donation or volunteering your time, every contribution matters.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/donate">Donate Today</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
