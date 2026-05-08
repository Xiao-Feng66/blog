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

  if (loading) return <p className="text-gray-500">加载中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <PostForm initialData={post!} />
    </div>
  );
}
