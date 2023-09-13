import MarkdownIt from "markdown-it";
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItMark from 'markdown-it-mark'

import hljs from "highlight.js";

export default async function markdownToHtml(value: string) {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true })
              .value +
            "</code></pre>"
          );
        } catch (__) {}
      }

      return (
        '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
      );
    },
  });
  md.use(MarkdownItEmoji)
  md.use(MarkdownItMark)
  md.linkify.set({ fuzzyEmail: false });
  return md.render(value);
}
