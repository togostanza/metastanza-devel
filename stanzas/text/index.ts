import { HtmlRenderer, Parser } from "commonmark";
import hljs from "highlight.js";
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";
import "katex/dist/katex.mjs";
import MetaStanza from "../../lib/MetaStanza";

/**
 * Handler function for menu item actions
 */
interface MenuItemHandler {
  (): void;
}

/**
 * Menu item configuration for the text stanza
 */
interface MenuItem {
  type: "item";
  label: string;
  handler: MenuItemHandler;
}

/**
 * Text stanza component that supports both plain text and Markdown rendering
 * with syntax highlighting and math formula support
 */
export default class Text extends MetaStanza {
  private static readonly KATEX_CSS_URL =
    "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css";
  private static readonly MARKDOWN_MODE = "markdown";
  private static readonly CONTAINER_CLASS = "container";
  private static readonly PARAGRAPH_CLASS = "paragraph";
  private static readonly HIGHLIGHT_CSS_ATTRIBUTE =
    "data-togostanza-highlight_css_url";
  private static readonly HIGHLIGHT_CSS_DATA_ATTRIBUTE =
    "data-togostanza-highlight-css";

  /**
   * Creates a new Text stanza instance
   * @param element - The HTML element to render the stanza in
   * @param metadata - Metadata configuration for the stanza
   * @param templates - Template configurations
   * @param url - The URL of the stanza
   */
  constructor(
    element: HTMLElement,
    metadata: any,
    templates: any,
    url: string
  ) {
    super(element, metadata, templates, url);
    this.importWebFontCSS(Text.KATEX_CSS_URL);
  }

  /**
   * Returns the menu items available for this stanza
   * @returns Array of menu items with download functionality
   */
  menu(): MenuItem[] {
    return [
      {
        type: "item",
        label: "Download Text",
        handler: this._handleDownload.bind(this),
      },
    ];
  }

  /**
   * Handles the download functionality for the text content
   * @private
   */
  private _handleDownload(): void {
    try {
      const textBlob = new Blob([this._data], { type: "text/plain" });
      const textUrl = URL.createObjectURL(textBlob);
      const link = this._createDownloadLink(textUrl);

      document.body.append(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(textUrl);
    } catch (error) {
      console.error("Failed to download text:", error);
    }
  }

  /**
   * Creates a download link element
   * @param url - The blob URL to download from
   * @returns The configured download link element
   * @private
   */
  private _createDownloadLink(url: string): HTMLAnchorElement {
    const link = document.createElement("a");
    link.href = url;
    link.download = this._getDownloadFileName();
    return link;
  }

  /**
   * Checks if the stanza is in Markdown rendering mode
   * @returns True if in Markdown mode, false otherwise
   * @private
   */
  private _isMarkdownMode(): boolean {
    return this.params["data-mode"] === Text.MARKDOWN_MODE;
  }

  /**
   * Gets the appropriate filename for download based on the rendering mode
   * @returns The filename with appropriate extension
   * @private
   */
  private _getDownloadFileName(): string {
    return this._isMarkdownMode() ? "text.md" : "text.txt";
  }

  /**
   * Renders the text content in the stanza
   * Supports both plain text and Markdown with syntax highlighting and math formulas
   */
  async renderNext(): Promise<void> {
    try {
      const root: HTMLElement = this._main;
      const data: string = this._data;

      this._appendHighlightCss(this.params["data-highlight_css_url"]);
      this._clearExistingContent(root);

      const container = this._createContainer(root);
      const paragraph = this._createParagraph(container);

      if (this._isMarkdownMode()) {
        this._renderMarkdown(paragraph, data, root);
      } else {
        this._renderPlainText(paragraph, data);
      }
    } catch (error) {
      console.error("Failed to render text content:", error);
    }
  }

  /**
   * Clears any existing content containers
   * @param root - The root element to clear
   * @private
   */
  private _clearExistingContent(root: HTMLElement): void {
    const existingElements = this.root.querySelectorAll(
      `.${Text.CONTAINER_CLASS}`
    );
    existingElements.forEach((el: Element) => {
      el.parentNode?.removeChild(el);
    });
  }

  /**
   * Creates and appends a container element
   * @param root - The parent element
   * @returns The created container element
   * @private
   */
  private _createContainer(root: HTMLElement): HTMLDivElement {
    const container = document.createElement("div");
    container.classList.add(Text.CONTAINER_CLASS);
    root.append(container);
    return container;
  }

  /**
   * Creates and appends a paragraph element
   * @param container - The parent container
   * @returns The created paragraph element
   * @private
   */
  private _createParagraph(container: HTMLDivElement): HTMLParagraphElement {
    const paragraph = document.createElement("p");
    paragraph.classList.add(Text.PARAGRAPH_CLASS);
    container.append(paragraph);
    return paragraph;
  }

  /**
   * Renders content as Markdown with syntax highlighting and math support
   * @param paragraph - The paragraph element to render into
   * @param data - The Markdown content to render
   * @param root - The root element for post-processing
   * @private
   */
  private _renderMarkdown(
    paragraph: HTMLParagraphElement,
    data: string,
    root: HTMLElement
  ): void {
    const parser = new Parser();
    const renderer = new HtmlRenderer();
    const html = renderer.render(parser.parse(data));

    paragraph.innerHTML = html;
    this._applySyntaxHighlighting(root);
    renderMathInElement(root);
  }

  /**
   * Renders content as plain text
   * @param paragraph - The paragraph element to render into
   * @param data - The text content to render
   * @private
   */
  private _renderPlainText(
    paragraph: HTMLParagraphElement,
    data: string
  ): void {
    paragraph.textContent = data;
  }

  /**
   * Applies syntax highlighting to code blocks
   * @param root - The root element containing code blocks
   * @private
   */
  private _applySyntaxHighlighting(root: HTMLElement): void {
    root.querySelectorAll("pre code").forEach((el: Element) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }

  /**
   * Appends highlight CSS if provided
   * @param highlightCssUrl - The URL of the highlight CSS to load
   * @private
   */
  private _appendHighlightCss(highlightCssUrl: string): void {
    this._removeExistingHighlightCss();

    if (highlightCssUrl) {
      const link = this._createHighlightCssLink(highlightCssUrl);
      this.root.append(link);
    }
  }

  /**
   * Removes any existing highlight CSS links
   * @private
   */
  private _removeExistingHighlightCss(): void {
    const links = this.root.querySelectorAll(
      `link[${Text.HIGHLIGHT_CSS_ATTRIBUTE}]`
    );
    links.forEach((link) => link.remove());
  }

  /**
   * Creates a link element for highlight CSS
   * @param url - The CSS URL to link
   * @returns The configured link element
   * @private
   */
  private _createHighlightCssLink(url: string): HTMLLinkElement {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", url);
    link.setAttribute(Text.HIGHLIGHT_CSS_DATA_ATTRIBUTE, "");
    return link;
  }
}
