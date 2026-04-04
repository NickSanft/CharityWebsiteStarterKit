import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { PostWithAuthor } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
};

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stories, updates, and insights from our organization.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as PostWithAuthor} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
