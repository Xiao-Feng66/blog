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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">标签</h1>
        <p className="mt-3 text-muted dark:text-muted-dark">按主题浏览文章</p>
      </header>

      {tags.length === 0 ? (
        <p className="text-muted dark:text-muted-dark py-12 text-center">暂无标签</p>
      ) : (
        <div className="flex flex-wrap gap-3 animate-fade-in stagger-1">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="group px-5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark hover:border-accent hover:shadow-sm transition-all duration-200"
            >
              <span className="font-medium text-stone-700 dark:text-stone-300 group-hover:text-accent transition-colors">
                {tag.name}
              </span>
              <span className="ml-2 text-sm text-muted dark:text-muted-dark tabular-nums">
                {tag._count.posts}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
