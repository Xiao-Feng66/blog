import Link from "next/link";
import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "标签",
};

export default async function TagsPage() {
  const tags = useMock
    ? mockDb.getAllTags()
    : await prisma.tag.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { name: "asc" },
      });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">标签</h1>
      {tags.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {tag.name}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {tag._count.posts}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
