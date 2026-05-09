import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { JSX } from "react";


export async function renderMDX(source: string): Promise<JSX.Element> {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: { light: "github-light-high-contrast", dark: "github-dark" },
              defaultColor: false,
              defaultLanguage: "text",
            },
          ],
        ],
      },
    },
  });

  return content;
}
