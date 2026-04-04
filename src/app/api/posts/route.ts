import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const publishedOnly = searchParams.get('published') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));

  const where = publishedOnly ? { published: true } : {};

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: publishedOnly ? { publishedAt: 'desc' } : { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const existing = await prisma.post.findUnique({ where: { slug: postSlug } });
  if (existing) {
    return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug: postSlug,
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      coverImage: coverImage || null,
      tags: tags || [],
      published: !!published,
      publishedAt: published ? new Date() : null,
      authorId: session.user?.id as string,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
