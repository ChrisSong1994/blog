import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItDeflist from "markdown-it-deflist";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItCopy from "markdown-it-copy";

import hljs from "highlight.js";

export default async function markdownToHtml(value: string) {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    highlight: function (str, lang) {
      let codeContent = "";
      if (lang && hljs.getLanguage(lang)) {
        codeContent = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } else {
        codeContent = md.utils.escapeHtml(str);
      }

      return `<pre class="hljs"><code>${codeContent}</code></pre>`;
    },
  });
  md.use(MarkdownItEmoji);
  md.use(MarkdownItMark);
  md.use(MarkdownItAbbr);
  md.use(MarkdownItDeflist);
  md.use(MarkdownItFootnote);
  md.use(MarkdownItSub);
  md.use(MarkdownItSup);
  md.use(MarkdownItCopy, {
    showCodeLanguage: true,
  });
  md.linkify.set({ fuzzyEmail: false });
  return md.render(value);
}
