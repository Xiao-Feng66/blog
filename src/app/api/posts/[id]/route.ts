import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { requireAdmin } from "@/lib/apiAuth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const post = useMock
    ? mockDb.getPostById(id)
    : await prisma.post.findUnique({
        where: { id },
        include: { tags: { include: { tag: true } } },
      });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, context: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const body = await request.json();
  const { title, slug, content, summary, coverImage, status, tagIds } = body;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      summary,
      coverImage,
      status,
      tags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map((tagId: string) => ({ tagId })),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(post);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  await prisma.post.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
