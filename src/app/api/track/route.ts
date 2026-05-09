import { prisma, useMock } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  if (useMock) return new NextResponse(null, { status: 204 });

  const body = await request.json();
  const path = body.path as string;
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const dateKey = new Date().toISOString().slice(0, 10);
  const sessionId = createHash("sha256").update(`${ip}:${ua}:${dateKey}`).digest("hex").slice(0, 32);

  const postId = body.postId || null;

  await prisma.pageView.create({
    data: { path, postId, sessionId },
  });

  return new NextResponse(null, { status: 204 });
}
