import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

interface PostCardProps {
  slug: string;
  title: string;
  summary: string;
  createdAt: Date;
  tags: { name: string; slug: string }[];
}

export function PostCard({ slug, title, summary, createdAt, tags }: PostCardProps) {
  return (
    <article className="py-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <Link href={`/posts/${slug}`} className="group">
        <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h2>
      </Link>
      <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">{summary}</p>
      <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={new Date(createdAt).toISOString()}>{formatDate(createdAt)}</time>
        {tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
