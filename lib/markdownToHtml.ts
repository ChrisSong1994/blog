import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import html from "remark-html";
import rehypeHighlight from "rehype-highlight";

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html)
    .use(remarkGfm)
    .use(remarkToc)
    .use(rehypeHighlight)
    .process(markdown);
  return result.toString();
}
