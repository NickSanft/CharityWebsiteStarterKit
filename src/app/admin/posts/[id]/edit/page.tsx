import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostForm } from '@/components/blog/post-form';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Post',
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Post</h1>
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          coverImage: post.coverImage || '',
          tags: (post.tags as string[]) || [],
          published: post.published,
        }}
      />
    </div>
  );
}
