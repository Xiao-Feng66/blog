import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import type { JSX } from "react";

export async function renderMDX(source: string): Promise<JSX.Element> {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: { light: "github-light", dark: "github-dark" },
            },
          ],
        ],
      },
    },
  });

  return content;
}
