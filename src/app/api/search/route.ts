import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { NextResponse } from "next/server";

export async function GET() {
  if (useMock) {
    return NextResponse.json(mockDb.getSearchablePosts());
  }

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      content: true,
      createdAt: true,
      tags: { select: { tag: { select: { name: true, slug: true } } } },
    },
  });

  const normalized = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    content: p.content,
    createdAt: p.createdAt,
    tags: p.tags.map((t) => t.tag),
  }));

  return NextResponse.json(normalized);
}
