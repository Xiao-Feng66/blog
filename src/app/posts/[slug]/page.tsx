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
    <article className="mx-auto max-w-2xl px-6 py-20 animate-fade-in">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-xs text-muted dark:text-muted-dark mb-6">
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          {post.tags.map((pt) => (
            <Link
              key={pt.tag.slug}
              href={`/tags/${pt.tag.slug}`}
              className="hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
            >
              {pt.tag.name}
            </Link>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-ink dark:text-ink-dark leading-snug">
          {post.title}
        </h1>
      </header>
      <div className="prose dark:prose-invert prose-stone max-w-none prose-headings:font-light prose-headings:tracking-tight prose-p:leading-[1.85] prose-li:leading-[1.85] prose-pre:bg-stone-50 dark:prose-pre:bg-stone-900">
        {content}
      </div>
      <Comments />
    </article>
  );
}
