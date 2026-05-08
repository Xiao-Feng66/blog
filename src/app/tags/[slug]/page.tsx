import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 10;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return { title: `标签: ${tag.name}` };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const [postTags, total] = await Promise.all([
    prisma.postTag.findMany({
      where: { tagId: tag.id, post: { status: "published" } },
      include: { post: { include: { tags: { include: { tag: true } } } } },
      orderBy: { post: { createdAt: "desc" } },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.postTag.count({
      where: { tagId: tag.id, post: { status: "published" } },
    }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">标签: {tag.name}</h1>
      {postTags.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      ) : (
        <>
          <div>
            {postTags.map((pt) => (
              <PostCard
                key={pt.post.id}
                slug={pt.post.slug}
                title={pt.post.title}
                summary={pt.post.summary}
                createdAt={pt.post.createdAt}
                tags={pt.post.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug }))}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/tags/${slug}`}
          />
        </>
      )}
    </div>
  );
}
