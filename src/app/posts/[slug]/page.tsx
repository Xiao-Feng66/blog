import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";
import { renderMDX } from "@/lib/mdx";
import { formatDate } from "@/lib/formatDate";
import { Comments } from "@/components/blog/Comments";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = useMock
    ? mockDb.getPostMetaBySlug(slug)
    : await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = useMock
    ? mockDb.getPostBySlug(slug)
    : await prisma.post.findUnique({
        where: { slug, status: "published" },
        include: { tags: { include: { tag: true } } },
      });

  if (!post) notFound();

  const content = await renderMDX(post.content);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark mb-4">
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          {post.tags.length > 0 && (
            <>
              <span className="text-border dark:text-border-dark">&middot;</span>
              <div className="flex gap-1.5">
                {post.tags.map((pt) => (
                  <Link
                    key={pt.tag.slug}
                    href={`/tags/${pt.tag.slug}`}
                    className="text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors"
                  >
                    #{pt.tag.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
          {post.title}
        </h1>
      </header>
      <div className="prose dark:prose-invert prose-stone max-w-none prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-pre:bg-stone-50 dark:prose-pre:bg-stone-900 prose-code:text-accent-dark dark:prose-code:text-accent-light">
        {content}
      </div>
      <Comments />
    </article>
  );
}
