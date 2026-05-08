import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let totalPosts, publishedPosts, draftPosts;
  if (useMock) {
    const stats = mockDb.getDashboardStats();
    totalPosts = stats.total;
    publishedPosts = stats.published;
    draftPosts = stats.draft;
  } else {
    [totalPosts, publishedPosts, draftPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
    ]);
  }

  const stats = [
    { label: "总文章数", value: totalPosts },
    { label: "已发布", value: publishedPosts },
    { label: "草稿", value: draftPosts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            <div className="text-3xl font-bold mt-1">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
