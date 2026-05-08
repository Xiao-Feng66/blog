import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">关于</h1>
      <div className="prose dark:prose-invert">
        <p>欢迎来到我的博客。</p>
      </div>
    </div>
  );
}
