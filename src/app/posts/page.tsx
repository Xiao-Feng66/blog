import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文章",
};

const POSTS_PER_PAGE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [posts, total] = useMock
    ? [mockDb.getPublishedPosts(currentPage, POSTS_PER_PAGE), mockDb.getPublishedPostCount()]
    : await Promise.all([
        prisma.post.findMany({
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          skip: (currentPage - 1) * POSTS_PER_PAGE,
          take: POSTS_PER_PAGE,
          include: { tags: { include: { tag: true } } },
        }),
        prisma.post.count({ where: { status: "published" } }),
      ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-16 animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-ink dark:text-ink-dark">文章</h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted dark:text-muted-dark py-16 text-center text-sm">暂无文章</p>
      ) : (
        <>
          <div className="divide-y divide-border dark:divide-border-dark">
            {posts.map((post, i) => (
              <div key={post.id} className={`animate-slide-up stagger-${Math.min(i + 1, 5)}`}>
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  summary={post.summary}
                  createdAt={post.createdAt}
                  tags={post.tags.map((pt) => ({ name: pt.tag.name, slug: pt.tag.slug }))}
                />
              </div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/posts" />
        </>
      )}
    </div>
  );
}
