import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = useMock
    ? mockDb.getSearchablePosts()
    : await prisma.post.findMany({
        where: { status: "published" },
        select: { id: true, title: true, slug: true, summary: true },
      });
  return NextResponse.json(posts);
}
