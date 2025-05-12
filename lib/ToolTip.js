import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import Handlebars from "handlebars/dist/handlebars.js";
import DOMPurify from "dompurify";

/**
 * Utility function to check if a given node exists in a NodeList.
 * @param {NodeList} nodeList - The NodeList to check.
 * @param {Node} node - The node to search for.
 * @returns {boolean} True if the node is present in nodeList.
 */
function isInNodeList(nodeList, node) {
  for (const nodeInList of nodeList.values()) {
    if (node === nodeInList) {
      return true;
    }
  }
  return false;
}

/**
 * ToolTip component.
 * Extends LitElement to implement tooltip functionality.
 */
export default class ToolTip extends LitElement {
  constructor() {
    super();

    // Array holding the nodes targeted by the tooltip.
    this.nodes = [];
    // Flag indicating whether the tooltip is currently displayed.
    this.showing = false;
    // The text or HTML content to be displayed in the tooltip.
    this.tooltipContent = "";
    // Helper function to interpret tooltip content as HTML.
    this.tooltipHTML = (content) => html`${content}`;
    this.handlebarsTemplate = null;
    this.tooltipsVariables = null;
    // Reference to the tooltip element.
    this.tooltip = createRef();
    // Reference to the origin element (used for relative positioning).
    this.origin = createRef();

    // Timer for delayed hiding.
    this.hideDelayTimer = null;

    // Mouseout event listener.
    this.mouseEL = (e) => {
      // If the relatedTarget is inside the tooltip itself, do nothing further.
      if (
        e.relatedTarget &&
        e.relatedTarget.tagName === "TOGOSTANZA--TOOLTIP"
      ) {
        if (this.hideDelayTimer) {
          clearTimeout(this.hideDelayTimer);
          this.hideDelayTimer = null;
        }
        return;
      }

      // When the mouse enters an element within the targeted nodes, show the tooltip.
      if (isInNodeList(this.nodes, e.relatedTarget)) {
        // Cancel any pending hide delay.
        if (this.hideDelayTimer) {
          clearTimeout(this.hideDelayTimer);
          this.hideDelayTimer = null;
        }
        // Get the position of the origin element.
        const originRect = this.origin.value.getBoundingClientRect();
        const target = e.relatedTarget;
        // Get the position of the target element.
        const rect = target.getBoundingClientRect();
        // Determine whether the tooltip content is HTML.
        this.tooltipContent = DOMPurify.sanitize(target.dataset.tooltip);
        // Calculate and set the tooltip's display position.
        this.tooltip.value.style.left =
          rect.x + rect.width * 0.5 - originRect.x + "px";
        this.tooltip.value.style.top = rect.y - originRect.y - 5 + "px";
        this.showing = true;
      } else {
        // Schedule hiding the tooltip after 300ms delay.
        if (this.hideDelayTimer) {
          clearTimeout(this.hideDelayTimer);
        }
        this.hideDelayTimer = setTimeout(() => {
          this.showing = false;
          this.hideDelayTimer = null;
        }, 300);
      }
    };
  }

  /**
   * Define reactive internal properties for the component.
   */
  static get properties() {
    return {
      // NodeList of nodes targeted by the tooltip.
      nodes: { type: NodeList, state: true },
      // Content to display in the tooltip.
      tooltipContent: { type: String, state: true },
      // Whether the tooltip is visible.
      showing: { type: Boolean, state: true },
    };
  }

  /**
   * CSS styles definition.
   */
  static get styles() {
    return css`
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .tooltip {
        padding: 2px 12px;
        position: absolute;
        z-index: 10000;
        background-color: white;
        filter: drop-shadow(0 0.5px 1px black);
        color: var(--togostanza-fonts-font_color);
        font-size: calc(var(--togostanza-fonts-font_size_secondary) * 1px);
        line-height: 1.5;
        transform: translate(-50%, -100%);
        border-radius: 10px;
        opacity: 0;
        visibility: hidden;
        transition: height 0ms 250ms linear, opacity 200ms 0ms linear;
      }
      .tooltip::before {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 0 4px;
        border-color: white transparent transparent transparent;
        display: block;
        position: absolute;
        left: 50%;
        bottom: -5px;
        transform: translateX(-50%);
      }
      .tooltip.-show {
        opacity: 1;
        visibility: visible;
        transition: height 0ms 0ms linear, opacity 200ms 0ms linear, left 200ms,
          top 200ms;
      }
    `;
  }

  /**
   * Render method.
   * Generates the origin and tooltip DOM elements and binds their references.
   */
  render() {
    return html`
      <div class="origin" ${ref(this.origin)}></div>
      <div class="tooltip ${this.showing ? "-show" : ""}" ${ref(this.tooltip)}>
        <div .innerHTML=${this.tooltipContent}></div>
      </div>
    `;
  }

  /**
   * Called when the component is removed from the DOM.
   * Removes the parent's event listener to prevent memory leaks.
   */
  disconnectedCallback() {
    if (this.parentElement) {
      this.parentElement.removeEventListener("mouseout", this.mouseEL);
    }
    super.disconnectedCallback();
  }

  /**
   * Generates a Handlebars template from a template string.
   * @param {string} templateStr - The Handlebars template string.
   */
  setTemplate(templateStr) {
    this.handlebarsTemplate = Handlebars.compile(templateStr);
    this.tooltipsVariables = this.getTemplateVariables(templateStr);
  }

  /**
   * Compiles the Handlebars template with the provided data.
   * @param {Object} data - Data object to compile the template.
   * @returns {string} The compiled template content.
   */
  compile(data) {
    const contents = Object.fromEntries(
      this.tooltipsVariables.map((variable) => [variable, data[variable]])
    );
    return this.handlebarsTemplate(contents);
  }

  /**
   * Sets up tooltip target nodes.
   * Adds a mouseout event listener to the parent element.
   * @param {NodeList | Array} nodes - The nodes to be used as tooltip targets.
   */
  setup(nodes) {
    this.nodes = [...nodes];
    this.parentElement.addEventListener("mouseout", this.mouseEL);
  }

  /**
   * Extracts the top-level variable names used in a Handlebars template string.
   * @param {string} templateStr - The Handlebars template string.
   * @returns {string[]} An array of unique variable names.
   */
  getTemplateVariables(templateStr) {
    // Parse the template string into an AST.
    const ast = Handlebars.parse(templateStr);
    // A set to store unique variable names.
    const vars = new Set();

    // Recursively traverse the AST.
    function walk(node) {
      if (!node || typeof node !== "object") {
        return;
      }

      // Check for MustacheStatement ({{foo}}), BlockStatement ({{#if foo}}...{{/if}}), etc.
      if (
        node.type === "MustacheStatement" ||
        node.type === "BlockStatement" ||
        node.type === "PartialStatement" ||
        node.type === "SubExpression"
      ) {
        // node.path.parts is an array like ['foo', 'bar', ...]; use the first element as the top-level key.
        if (node.path && Array.isArray(node.path.parts)) {
          vars.add(node.path.parts[0]);
        }
      }

      // Recursively traverse child nodes.
      for (const key of Object.keys(node)) {
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach(walk);
        } else {
          walk(child);
        }
      }
    }

    walk(ast);
    return Array.from(vars);
  }
}

// Register the custom element.
customElements.define("togostanza--tooltip", ToolTip);
