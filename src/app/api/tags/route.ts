import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { requireAdmin } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const tags = useMock
    ? mockDb.getAllTags()
    : await prisma.tag.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { name: "asc" },
      });
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { name, slug } = await request.json();
  const tag = await prisma.tag.create({ data: { name, slug } });
  return NextResponse.json(tag, { status: 201 });
}
