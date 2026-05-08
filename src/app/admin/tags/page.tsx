"use client";

import { useEffect, useState } from "react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    const data = await fetch("/api/tags").then((r) => r.json());
    setTags(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/tags/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
    } else {
      await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
    }
    setName("");
    setSlug("");
    setEditingId(null);
    loadTags();
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除这个标签吗？")) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    loadTags();
  }

  function handleEdit(tag: Tag) {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-8">标签管理</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="标签名"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
          }}
          required
          className="px-4 py-2 rounded-xl border border-border dark:border-border-dark bg-transparent text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="px-4 py-2 rounded-xl border border-border dark:border-border-dark bg-transparent text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors text-sm font-medium"
        >
          {editingId ? "更新" : "添加"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setName(""); setSlug(""); }}
            className="px-5 py-2 rounded-xl border border-border dark:border-border-dark text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            取消
          </button>
        )}
      </form>

      {loading ? (
        <div className="py-12 text-center text-muted dark:text-muted-dark">加载中...</div>
      ) : tags.length === 0 ? (
        <div className="py-12 text-center text-muted dark:text-muted-dark">暂无标签</div>
      ) : (
        <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-border-dark text-left text-xs font-medium text-muted dark:text-muted-dark uppercase tracking-wider">
                <th className="px-5 py-3">名称</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">文章数</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-stone-800 dark:text-stone-200">{tag.name}</td>
                  <td className="px-5 py-4 text-sm text-muted dark:text-muted-dark font-mono">{tag.slug}</td>
                  <td className="px-5 py-4 text-sm tabular-nums">{tag._count.posts}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-sm">
                      <button onClick={() => handleEdit(tag)} className="text-accent hover:text-accent-dark transition-colors">
                        编辑
                      </button>
                      <button onClick={() => handleDelete(tag.id)} className="text-red-500 hover:text-red-600 transition-colors">
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
