import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, tags, published } = body;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const postSlug = slug?.trim() ? slugify(slug) : slugify(title);

  // Check slug uniqueness (excluding this post)
  const slugConflict = await prisma.post.findFirst({
    where: { slug: postSlug, id: { not: id } },
  });
  if (slugConflict) {
    return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
  }

  // If publishing for the first time, set publishedAt
  const publishedAt =
    published && !existing.publishedAt
      ? new Date()
      : published
        ? existing.publishedAt
        : null;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: title.trim(),
      slug: postSlug,
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      coverImage: coverImage || null,
      tags: tags || [],
      published: !!published,
      publishedAt,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
