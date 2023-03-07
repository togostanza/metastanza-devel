import MetaStanza from "../../lib/MetaStanza";
import { Parser, HtmlRenderer } from "commonmark";
import hljs from "highlight.js";
import "katex/dist/katex.mjs";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";

export default class Text extends MetaStanza {
  constructor() {
    super(...arguments);

    this.importWebFontCSS(
      "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css"
    );
  }

  menu() {
    return [
      {
        type: "item",
        label: "Download Text",
        handler: () => {
          const textBlob = new Blob([this._data], {
            type: "text/plain",
          });
          const textUrl = URL.createObjectURL(textBlob);
          const link = document.createElement("a");
          document.body.append(link);
          link.href = textUrl;
          link.download = this._downloadFileName();
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(textUrl);
        },
      },
    ];
  }

  _isMarkdownMode() {
    return this.params["data-mode"] === "markdown";
  }

  _downloadFileName() {
    if (this._isMarkdownMode()) {
      return "text.md";
    }
    return "text.txt";
  }

  async renderNext() {
    const root = this._main;
    const data = this._data;
    appendHighlightCss(this, this.params["data-highlight_css_url"]);

    const existEl = this.root.querySelectorAll(".container");
    if (existEl.length > 0) {
      existEl.forEach((el) => el.parentNode.removeChild(el));
    }

    const container = document.createElement("div");
    container.classList.add("container");
    root.append(container);

    const paragraph = document.createElement("p");
    paragraph.classList.add("paragraph");
    container.append(paragraph);

    if (this._isMarkdownMode()) {
      const parser = new Parser();
      const renderer = new HtmlRenderer();
      const html = renderer.render(parser.parse(data));
      paragraph.innerHTML = html;
      root.querySelectorAll("pre code").forEach((el) => {
        hljs.highlightElement(el);
      });
      renderMathInElement(root);
    } else {
      paragraph.textContent = data;
    }
  }
}

function appendHighlightCss(stanza, highlightCssUrl) {
  const links = stanza.root.querySelectorAll(
    "link[data-togostanza-highlight_css_url]"
  );
  for (const link of links) {
    link.remove();
  }

  if (highlightCssUrl) {
    const link = document.createElement("link");
    stanza.root.append(link);

    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", highlightCssUrl);
    link.setAttribute("data-togostanza-highlight-css", "");
  }
}
