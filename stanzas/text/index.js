import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import * as commonmark from "commonmark";
import hljs from "highlight.js";
import "katex/dist/katex.mjs";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";
import { appendCustomCss } from "togostanza-utils";

export default class Text extends Stanza {
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
          const textBlob = new Blob([this._dataset], {
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

  async render() {
    this.renderTemplate({
      template: "stanza.html.hbs",
    });
    const main = this.root.querySelector("main");
    const el = this.root.getElementById("text");
    const value = await loadData(this.params["data-url"], "text", main);
    this._dataset = value;

    appendCustomCss(this, this.params["custom_css_url"]);
    appendHighlightCss(this, this.params["data-highlight_css_url"]);

    const container = document.createElement("div");
    container.classList.add("container");
    el.append(container);

    const paragraph = document.createElement("p");
    paragraph.classList.add("paragraph");
    container.append(paragraph);

    if (this._isMarkdownMode()) {
      const parser = new commonmark.Parser();
      const renderer = new commonmark.HtmlRenderer();
      const html = renderer.render(parser.parse(value));
      paragraph.innerHTML = html;
      main.querySelectorAll("pre code").forEach((el) => {
        hljs.highlightElement(el);
      });
      renderMathInElement(main);
    } else {
      paragraph.textContent = this._dataset;
    }
  }
}

export function appendHighlightCss(stanza, highlightCssUrl) {
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
