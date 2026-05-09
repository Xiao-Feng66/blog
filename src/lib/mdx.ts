import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import type { JSX } from "react";


export async function renderMDX(source: string): Promise<JSX.Element> {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: { light: "github-light-high-contrast", dark: "github-dark" },
            },
          ],
        ],
      },
    },
  });

  return content;
}
