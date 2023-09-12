import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import showdown from "showdown";

showdown.extension("highlight", function () {
  function htmlunencode(text) {
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
  return [
    {
      type: "output",
      filter: function (text, converter, options) {
        var left = "<pre><code\\b[^>]*>",
          right = "</code></pre>",
          flags = "g";
        var replacement = function (wholeMatch, match, left, right) {
          match = htmlunencode(match);
          var lang = (left.match(/class=\"([^ \"]+)/) || [])[1];
          left = left.slice(0, 18) + "hljs " + left.slice(18);
          if (lang && hljs.getLanguage(lang)) {
            return (
              left + hljs.highlight(match, { language: lang }).value + right
            );
          } else {
            return left + hljs.highlightAuto(match).value + right;
          }
        };
        return showdown.helper.replaceRecursiveRegExp(
          text,
          replacement,
          left,
          right,
          flags
        );
      },
    },
  ];
});

export default async function markdownToHtml(markdown: string) {
  const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
    ghMentions: true,
    extensions: ["highlight"],
    tables: true,
  });
  converter.setFlavor("github");
  const html = converter.makeHtml(markdown);
  return html;
}
