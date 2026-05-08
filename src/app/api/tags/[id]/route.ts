import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const { name, slug } = await request.json();
  const tag = await prisma.tag.update({ where: { id }, data: { name, slug } });
  return NextResponse.json(tag);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
