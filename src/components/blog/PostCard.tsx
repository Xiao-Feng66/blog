import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

interface PostCardProps {
  slug: string;
  title: string;
  summary: string;
  createdAt: Date;
  tags: { name: string; slug: string }[];
}

export function PostCard({ slug, title, summary, createdAt }: PostCardProps) {
  return (
    <article className="py-7">
      <Link
        href={`/posts/${slug}`}
        className="flex items-baseline justify-between gap-6 group"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-normal text-ink dark:text-ink-dark group-hover:text-muted dark:group-hover:text-muted-dark transition-colors duration-300 leading-relaxed">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-muted dark:text-muted-dark line-clamp-1 leading-relaxed">
            {summary}
          </p>
        </div>
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="shrink-0 text-xs text-muted dark:text-muted-dark tabular-nums whitespace-nowrap"
        >
          {formatDate(createdAt)}
        </time>
      </Link>
    </article>
  );
}
