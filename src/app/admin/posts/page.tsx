"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  draft: "草稿",
  published: "已发布",
  hidden: "隐藏",
};

const statusStyles: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  hidden: "bg-stone-500/10 text-stone-500",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = filter ? `/api/posts?status=${filter}` : "/api/posts";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts))
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇文章吗？")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors text-sm font-medium"
        >
          + 新建文章
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {["", "draft", "published", "hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? "bg-accent text-white"
                : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            {s ? statusLabels[s] : "全部"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted dark:text-muted-dark">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-muted dark:text-muted-dark">暂无文章</div>
      ) : (
        <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border-dark text-left text-xs font-medium text-muted dark:text-muted-dark uppercase tracking-wider">
                <th className="px-5 py-3">标题</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3 hidden sm:table-cell">创建时间</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-stone-800 dark:text-stone-200">{post.title}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusStyles[post.status] || ""}`}>
                      {statusLabels[post.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted dark:text-muted-dark hidden sm:table-cell">{formatDate(post.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-sm">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-accent hover:text-accent-dark transition-colors">
                        编辑
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-600 transition-colors">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
