import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { requireAdmin } from "@/lib/apiAuth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const limit = 20;

  if (useMock) {
    const result = mockDb.getPostsForApi({ status: status ?? undefined, tag: tag ?? undefined, page, pageSize: limit });
    return NextResponse.json({ posts: result.posts, total: result.total, page, totalPages: Math.ceil(result.total / limit) });
  }

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (tag) where.tags = { some: { tag: { slug: tag } } };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const { title, slug, content, summary, coverImage, status, tagIds } = body;

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      summary,
      coverImage,
      status: status || "draft",
      tags: {
        create: (tagIds || []).map((tagId: string) => ({ tagId })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(post, { status: 201 });
}
