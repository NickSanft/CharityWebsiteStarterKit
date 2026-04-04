import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, truncate } from '@/lib/utils';
import type { PostWithAuthor } from '@/types';

interface PostCardProps {
  post: PostWithAuthor;
}

export function PostCard({ post }: PostCardProps) {
  const rawTags = post.tags;
  const tags: string[] = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
      ? JSON.parse(rawTags)
      : [];

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-2">
          {post.excerpt && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {truncate(post.excerpt, 150)}
            </p>
          )}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <span>{post.author.name}</span>
          <span className="mx-2">&middot;</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
