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
    <div className="mx-auto max-w-6xl px-8 py-20">
      <header className="mb-16 animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-ink dark:text-ink-dark">标签</h1>
      </header>

      {tags.length === 0 ? (
        <p className="text-muted dark:text-muted-dark py-16 text-center text-sm">暂无标签</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in stagger-1">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="group flex items-center justify-between px-5 py-4 rounded-lg border border-border dark:border-border-dark hover:border-ink/20 dark:hover:border-ink-dark/20 bg-white/50 dark:bg-white/[0.03] transition-all duration-300"
            >
              <span className="text-sm text-ink dark:text-ink-dark group-hover:text-ink/70 dark:group-hover:text-ink-dark/70 transition-colors duration-300">
                {tag.name}
              </span>
              <span className="text-xs text-muted dark:text-muted-dark tabular-nums">
                {tag._count.posts} 篇
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
