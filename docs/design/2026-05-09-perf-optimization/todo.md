# 博客前台加载性能优化 - 任务清单

> 状态：已完成

## 已完成

- [x] `/posts/[slug]/page.tsx`：添加 `generateStaticParams` + `revalidate = 86400`
- [x] `/tags/[slug]/page.tsx`：添加 `generateStaticParams` + `revalidate = 86400`
- [x] `/page.tsx`：添加 `revalidate = 86400`
- [x] `/posts/page.tsx`：添加 `revalidate = 86400`
- [x] `/tags/page.tsx`：移除 `force-dynamic`，添加 `revalidate = 86400`
- [x] `POST /api/posts/route.ts`：成功后 `revalidatePath('/', 'layout')`
- [x] `PUT/DELETE /api/posts/[id]/route.ts`：成功后 `revalidatePath('/', 'layout')`
- [x] `POST /api/tags/route.ts`：成功后 `revalidatePath('/', 'layout')`
- [x] `PUT/DELETE /api/tags/[id]/route.ts`：成功后 `revalidatePath('/', 'layout')`
- [x] `npm run build` 验证：文章页标注为 ● SSG，首页/标签列表标注为 ○ Static
