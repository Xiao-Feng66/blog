import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = useMock
    ? mockDb.getPublishedSlugs()
    : await prisma.post.findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true },
      });

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/tags`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    ...postEntries,
  ];
}
