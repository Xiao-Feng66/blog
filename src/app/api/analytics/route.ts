import { prisma, useMock } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const range = request.nextUrl.searchParams.get("range") || "7d";
  const days = range === "30d" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  if (useMock) {
    return NextResponse.json(mockDb.getAnalytics(days));
  }

  const [pvCount, uvResult, trend, topPosts] = await Promise.all([
    prisma.pageView.count({
      where: { createdAt: { gte: since } },
    }),

    prisma.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: since } },
    }),

    prisma.$queryRaw<{ date: string; pv: bigint; uv: bigint }[]>`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(*)::bigint as pv,
        COUNT(DISTINCT session_id)::bigint as uv
      FROM page_views
      WHERE created_at >= ${since}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY date
    `,

    prisma.$queryRaw<{ post_id: string; title: string; slug: string; views: bigint }[]>`
      SELECT
        pv.post_id,
        p.title,
        p.slug,
        COUNT(*)::bigint as views
      FROM page_views pv
      JOIN posts p ON p.id = pv.post_id
      WHERE pv.created_at >= ${since}
        AND pv.post_id IS NOT NULL
      GROUP BY pv.post_id, p.title, p.slug
      ORDER BY views DESC
      LIMIT 10
    `,
  ]);

  return NextResponse.json({
    pv: pvCount,
    uv: uvResult.length,
    trend: trend.map((row) => ({
      date: row.date,
      pv: Number(row.pv),
      uv: Number(row.uv),
    })),
    topPosts: topPosts.map((row) => ({
      postId: row.post_id,
      title: row.title,
      slug: row.slug,
      views: Number(row.views),
    })),
  });
}
