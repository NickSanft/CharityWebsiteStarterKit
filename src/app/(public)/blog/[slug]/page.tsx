import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  const rawTags = post.tags;
  const tags: string[] = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
      ? JSON.parse(rawTags)
      : [];

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {post.coverImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author.name}</span>
          <span>&middot;</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
