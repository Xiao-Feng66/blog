import { notFound } from "next/navigation";
import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
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
  const tag = useMock
    ? mockDb.getTagBySlug(slug)
    : await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return { title: `标签: ${tag.name}` };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const tag = useMock
    ? mockDb.getTagBySlug(slug)
    : await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  let postTags, total;
  if (useMock) {
    const result = mockDb.getPostsByTag(tag.id, currentPage, POSTS_PER_PAGE);
    postTags = result.items;
    total = result.total;
  } else {
    [postTags, total] = await Promise.all([
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
  }

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark mb-3">
          <Link href="/tags" className="hover:text-accent transition-colors">标签</Link>
          <span>/</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">{tag.name}</h1>
        <p className="mt-3 text-muted dark:text-muted-dark">共 {total} 篇文章</p>
      </header>

      {postTags.length === 0 ? (
        <p className="text-muted dark:text-muted-dark py-12 text-center">暂无文章</p>
      ) : (
        <>
          <div className="grid gap-4">
            {postTags.map((pt, i) => (
              <div key={pt.post.id} className={`animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
                <PostCard
                  slug={pt.post.slug}
                  title={pt.post.title}
                  summary={pt.post.summary}
                  createdAt={pt.post.createdAt}
                  tags={pt.post.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug }))}
                />
              </div>
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
