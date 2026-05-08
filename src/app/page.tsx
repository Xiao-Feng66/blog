import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";

const POSTS_PER_PAGE = 10;

export default async function Home({
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          最新文章
        </h1>
        <p className="mt-3 text-muted dark:text-muted-dark">
          记录技术探索与思考
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted dark:text-muted-dark py-12 text-center">暂无文章</p>
      ) : (
        <>
          <div className="grid gap-4">
            {posts.map((post, i) => (
              <div key={post.id} className={`animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
