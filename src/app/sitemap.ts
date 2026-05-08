import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
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
