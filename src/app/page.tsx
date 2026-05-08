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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">最新文章</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                summary={post.summary}
                createdAt={post.createdAt}
                tags={post.tags.map((pt) => ({ name: pt.tag.name, slug: pt.tag.slug }))}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
