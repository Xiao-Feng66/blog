import { prisma, useMock } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const params = request.nextUrl.searchParams;
  const from = params.get("from");
  const to = params.get("to");

  let since: Date;
  let until: Date;

  if (from && to) {
    since = new Date(from + "T00:00:00");
    until = new Date(to + "T23:59:59.999");
  } else {
    const range = params.get("range") || "7d";
    const days = range === "30d" ? 30 : 7;
    since = new Date();
    since.setDate(since.getDate() - days);
    until = new Date();
  }

  if (useMock) {
    const days = Math.max(1, Math.ceil((until.getTime() - since.getTime()) / 86400000));
    return NextResponse.json(mockDb.getAnalytics(days));
  }

  const [pvCount, uvResult, trend, topPosts] = await Promise.all([
    prisma.pageView.count({
      where: { createdAt: { gte: since, lte: until } },
    }),

    prisma.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: since, lte: until } },
    }),

    prisma.$queryRaw<{ date: string; pv: bigint; uv: bigint }[]>`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(*)::bigint as pv,
        COUNT(DISTINCT session_id)::bigint as uv
      FROM page_views
      WHERE created_at >= ${since} AND created_at <= ${until}
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
      WHERE pv.created_at >= ${since} AND pv.created_at <= ${until}
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
