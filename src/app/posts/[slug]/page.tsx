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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((pt) => (
                <Link
                  key={pt.tag.slug}
                  href={`/tags/${pt.tag.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  #{pt.tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="prose dark:prose-invert max-w-none">{content}</div>
      <Comments />
    </article>
  );
}
