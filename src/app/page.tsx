import Image from "next/image";
import { prisma, useMock } from "@/lib/db";

export const revalidate = 86400;
import { mockDb } from "@/lib/mockData";
import { PostCard } from "@/components/blog/PostCard";

export default async function Home() {
  const posts = useMock
    ? mockDb.getPublishedPosts(1, 3)
    : await prisma.post.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { tags: { include: { tag: true } } },
      });

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 animate-fade-in">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-10">
          <div className="absolute inset-0 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xl font-light text-muted dark:text-muted-dark">
            X
          </div>
          <Image
            src="/avatar.jpg"
            alt=""
            width={112}
            height={112}
            className="relative w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-light tracking-wide text-ink dark:text-ink-dark">
          XiaoFeng
        </h1>
        <p className="mt-3 text-sm text-muted dark:text-muted-dark text-center leading-relaxed">
          记录技术探索与思考
        </p>
        <div className="mt-20 text-muted dark:text-muted-dark animate-float">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>
      </section>

      {/* 最近文章 */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted dark:text-muted-dark mb-8">
          最新文章
        </h2>
        {posts.length === 0 ? (
          <p className="text-muted dark:text-muted-dark py-16 text-center text-sm">暂无文章</p>
        ) : (
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
        )}
      </section>
    </>
  );
}
