import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <PostForm />
    </div>
  );
}
