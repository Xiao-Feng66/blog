import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">关于</h1>
      </header>

      <div className="prose dark:prose-invert prose-stone max-w-none animate-fade-in stagger-1">
        <p>
          你好，欢迎来到我的博客。
        </p>
        <p>
          这里记录我在软件开发过程中的思考与实践——从后端架构到前端体验，
          从具体的技术方案到抽象的工程思维。
        </p>
        <p>
          写作是整理思路最好的方式。如果这些文章对你有帮助，那就更好了。
        </p>
      </div>
    </div>
  );
}
