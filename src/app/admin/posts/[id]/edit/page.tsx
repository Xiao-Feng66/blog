"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="py-12 text-center text-muted dark:text-muted-dark">加载中...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-8">编辑文章</h1>
      <PostForm initialData={post!} />
    </div>
  );
}
