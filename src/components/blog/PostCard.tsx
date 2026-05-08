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
    <article className="group relative rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6 transition-all duration-200 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 hover:-translate-y-0.5">
      <Link href={`/posts/${slug}`} className="absolute inset-0 rounded-xl" aria-hidden="true" />

      <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark mb-3">
        <time dateTime={new Date(createdAt).toISOString()}>{formatDate(createdAt)}</time>
        {tags.length > 0 && (
          <>
            <span className="text-border dark:text-border-dark">&middot;</span>
            <div className="flex gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="relative z-10 text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50 group-hover:text-accent transition-colors leading-snug">
        {title}
      </h2>

      <p className="mt-2 text-sm text-muted dark:text-muted-dark line-clamp-2 leading-relaxed">
        {summary}
      </p>
    </article>
  );
}
