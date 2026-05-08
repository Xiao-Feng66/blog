import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { id: true, title: true, slug: true, summary: true },
  });
  return NextResponse.json(posts);
}
