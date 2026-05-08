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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          新建文章
        </Link>
      </div>
      <div className="flex gap-2 mb-4">
        {["", "draft", "published", "hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === s
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "border border-gray-200 dark:border-gray-700"
            }`}
          >
            {s ? statusLabels[s] : "全部"}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">暂无文章</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-500">
              <th className="pb-2">标题</th>
              <th className="pb-2">状态</th>
              <th className="pb-2">创建时间</th>
              <th className="pb-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3">{post.title}</td>
                <td className="py-3 text-sm">{statusLabels[post.status]}</td>
                <td className="py-3 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                <td className="py-3 text-sm space-x-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-600 hover:underline">
                    编辑
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
