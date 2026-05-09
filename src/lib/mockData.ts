const tags = [
  { id: "t1", name: "前端", slug: "frontend" },
  { id: "t2", name: "后端", slug: "backend" },
  { id: "t3", name: "随笔", slug: "essay" },
];

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

const posts = [
  {
    id: "p1",
    title: "用 Next.js 搭建个人博客",
    slug: "building-blog-with-nextjs",
    content: `# 用 Next.js 搭建个人博客

## 为什么选择 Next.js

Next.js 提供了开箱即用的 SSG/ISR 能力，非常适合博客场景。结合 App Router，可以轻松实现：

- 静态生成文章页面
- 增量静态再生（ISR）
- 服务端组件减少客户端 JS

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 | 框架 |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式 |
| Prisma | ORM |
| Supabase | 数据库 + 认证 |

## 核心代码

\`\`\`typescript
// 获取文章列表
export async function getPosts(page: number = 1) {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * 10,
    take: 10,
  });
  return posts;
}
\`\`\`

## 部署

项目部署在 Vercel 上，每次推送到 main 分支自动部署。

> 博客的源码已开源，欢迎 Star。`,
    summary: "从零开始搭建一个基于 Next.js 的个人博客系统，使用 App Router、Prisma 和 Supabase。",
    coverImage: null,
    status: "published" as const,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
    tagIds: ["t1"],
  },
  {
    id: "p2",
    title: "TypeScript 类型体操入门",
    slug: "typescript-type-gymnastics",
    content: `# TypeScript 类型体操入门

TypeScript 的类型系统是图灵完备的，这意味着你可以用类型来做任何计算。

## 基础工具类型

\`\`\`typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
\`\`\`

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
\`\`\`

## 递归类型

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};
\`\`\`

掌握这些基础，你就能写出更安全、更灵活的 TypeScript 代码。`,
    summary: "掌握 TypeScript 高级类型系统：从 Pick、Omit 到条件类型和递归类型。",
    coverImage: null,
    status: "published" as const,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    tagIds: ["t1"],
  },
  {
    id: "p3",
    title: "Go 并发模式实践",
    slug: "go-concurrency-patterns",
    content: `# Go 并发模式实践

Go 的并发模型基于 CSP（Communicating Sequential Processes），核心是 goroutine 和 channel。

## Fan-out / Fan-in

\`\`\`go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        channels[i] = process(input)
    }
    return channels
}

func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                merged <- v
            }
        }(ch)
    }
    go func() { wg.Wait(); close(merged) }()
    return merged
}
\`\`\`

## Context 控制

用 context 控制 goroutine 的生命周期，避免 goroutine 泄漏。

## 实际应用

在我们的日志采集服务中，使用了 fan-out/fan-in 模式处理日志流，将吞吐量提升了 3 倍。`,
    summary: "探讨 Go 语言中常见的并发模式：Fan-out/Fan-in、Pipeline 和 Context 控制。",
    coverImage: null,
    status: "published" as const,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    tagIds: ["t2"],
  },
  {
    id: "p4",
    title: "2026 年技术展望（草稿）",
    slug: "tech-outlook-2026-draft",
    content: "# 2026 年技术展望\n\n这是一篇草稿，尚未完成。",
    summary: "对 2026 年技术趋势的思考和展望。",
    coverImage: null,
    status: "draft" as const,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    tagIds: ["t3"],
  },
  {
    id: "p5",
    title: "关于写作这件事",
    slug: "about-writing",
    content: `# 关于写作这件事

写技术博客不仅是知识输出，更是一种思维训练。

## 为什么要写

1. **费曼学习法** — 能教别人说明你真的懂了
2. **建立影响力** — 长期来看，写作是最好的个人品牌投资
3. **未来的自己** — 你以为你会记住，但你不会

## 怎么坚持

- 不追求完美，先发布再迭代
- 从小的技术笔记开始
- 设定固定的写作时间

希望这篇文章能给你一些启发。`,
    summary: "为什么写技术博客？如何开始并坚持？分享我的写作经验。",
    coverImage: null,
    status: "hidden" as const,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    tagIds: ["t3"],
  },
];

// -- 组装关联关系 --

type MockTag = (typeof tags)[number];
type MockPost = (typeof posts)[number];

interface PostWithTags extends Omit<MockPost, "tagIds"> {
  tags: { postId: string; tagId: string; tag: MockTag }[];
}

function buildPostWithTags(post: MockPost): PostWithTags {
  const { tagIds, ...rest } = post;
  return {
    ...rest,
    tags: tagIds.map((tagId) => ({
      postId: post.id,
      tagId,
      tag: tags.find((t) => t.id === tagId)!,
    })),
  };
}

const postsWithTags: PostWithTags[] = posts.map(buildPostWithTags);
const publishedPosts = postsWithTags.filter((p) => p.status === "published");

// -- 导出查询函数，模拟 Prisma 的返回值 --

export const mockDb = {
  // 首页：分页文章列表
  getPublishedPosts(page: number, pageSize: number = 10) {
    const start = (page - 1) * pageSize;
    return publishedPosts.slice(start, start + pageSize);
  },

  getPublishedPostCount() {
    return publishedPosts.length;
  },

  // 文章详情
  getPostBySlug(slug: string) {
    return postsWithTags.find((p) => p.slug === slug && p.status === "published") ?? null;
  },

  getPostMetaBySlug(slug: string) {
    const post = postsWithTags.find((p) => p.slug === slug);
    return post ? { title: post.title, summary: post.summary } : null;
  },

  // 标签列表（带文章计数）
  getAllTags() {
    return tags.map((tag) => ({
      ...tag,
      _count: { posts: posts.filter((p) => p.tagIds.includes(tag.id)).length },
    }));
  },

  // 按标签查文章
  getTagBySlug(slug: string) {
    return tags.find((t) => t.slug === slug) ?? null;
  },

  getPostsByTag(tagId: string, page: number, pageSize: number = 10) {
    const filtered = publishedPosts.filter((p) =>
      p.tags.some((t) => t.tagId === tagId)
    );
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize).map((post) => ({
        postId: post.id,
        tagId,
        post,
      })),
      total: filtered.length,
    };
  },

  // sitemap
  getPublishedSlugs() {
    return publishedPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  },

  // 管理后台仪表盘
  getDashboardStats() {
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    };
  },

  // API: 文章列表（支持筛选）
  getPostsForApi(options: { status?: string; tag?: string; page: number; pageSize: number }) {
    let filtered = postsWithTags as PostWithTags[];
    if (options.status) filtered = filtered.filter((p) => p.status === options.status);
    if (options.tag) filtered = filtered.filter((p) => p.tags.some((t) => t.tag.slug === options.tag));
    const total = filtered.length;
    const start = (options.page - 1) * options.pageSize;
    return { posts: filtered.slice(start, start + options.pageSize), total };
  },

  // API: 单篇文章
  getPostById(id: string) {
    return postsWithTags.find((p) => p.id === id) ?? null;
  },

  // API: 搜索
  getSearchablePosts() {
    return publishedPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content,
      createdAt: p.createdAt,
      tags: p.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug })),
    }));
  },
};
