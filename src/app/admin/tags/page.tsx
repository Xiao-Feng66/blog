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
    <div>
      <h1 className="text-2xl font-bold mb-6">标签管理</h1>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="标签名"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
          }}
          required
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-transparent"
        />
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editingId ? "更新" : "添加"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setName(""); setSlug(""); }}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md"
          >
            取消
          </button>
        )}
      </form>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : tags.length === 0 ? (
        <p className="text-gray-500">暂无标签</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-500">
              <th className="pb-2">名称</th>
              <th className="pb-2">Slug</th>
              <th className="pb-2">文章数</th>
              <th className="pb-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3">{tag.name}</td>
                <td className="py-3 text-sm text-gray-500">{tag.slug}</td>
                <td className="py-3 text-sm">{tag._count.posts}</td>
                <td className="py-3 text-sm space-x-3">
                  <button onClick={() => handleEdit(tag)} className="text-blue-600 hover:underline">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:underline">
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
