"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tag {
  id: string;
  name: string;
}

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary: string;
    coverImage: string | null;
    status: string;
    tags: { tagId: string }[];
  };
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags.map((t) => t.tagId) || []
  );
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags);
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9一-龥]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = { title, slug, content, summary, status, tagIds: selectedTagIds };
    const url = isEditing ? `/api/posts/${initialData.id}` : "/api/posts";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await fetch("/api/revalidate", { method: "POST" });
      router.push("/admin/posts");
    }

    setSaving(false);
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-transparent text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">摘要</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">状态</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="hidden">隐藏</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">标签</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => {
              const checked = selectedTagIds.includes(tag.id);
              return (
                <label
                  key={tag.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors border ${
                    checked
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border dark:border-border-dark text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedTagIds(
                        e.target.checked
                          ? [...selectedTagIds, tag.id]
                          : selectedTagIds.filter((id) => id !== tag.id)
                      );
                    }}
                    className="sr-only"
                  />
                  {tag.name}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">内容（Markdown）</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          required
          className={`${inputClass} font-mono`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent-dark disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {saving ? "保存中..." : isEditing ? "更新" : "创建"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-border dark:border-border-dark hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm"
        >
          取消
        </button>
      </div>
    </form>
  );
}
