import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";

function isInNodeList(nodeList, node) {
  for (const nodeInList of nodeList.values()) {
    if (node === nodeInList) {
      return true;
    }
  }
  return false;
}

export default class ToolTip extends LitElement {
  constructor() {
    super();

    this.tooltip = createRef();
    this.origin = createRef();

    this.nodes = [];
    this.showing = false;
    this.tooltipContent = "";
    this.tooltipHTML = (content) => html`${content}`;
    this.mouseEL = (e) => {
      if (isInNodeList(this.nodes, e.relatedTarget)) {
        // show tooltip
        const originRect = this.origin.value.getBoundingClientRect();
        const target = e.relatedTarget;
        const rect = target.getBoundingClientRect();
        if (target.dataset.tooltipHtml === "true") {
          this.tooltipContent = this.tooltipHTML(target.dataset.tooltip);
        } else {
          this.tooltipContent = target.dataset.tooltip;
        }
        this.tooltip.value.style.left =
          rect.x + rect.width * 0.5 - originRect.x + "px";
        this.tooltip.value.style.top = rect.y - originRect.y - 5 + "px";
        this.showing = true;
      } else {
        // hide tooltip
        this.showing = false;
      }
    };
  }

  static get properties() {
    return {
      nodes: { type: NodeList, state: true },
      tooltipContent: { type: String, state: true },
      showing: { type: Boolean, state: true },
    };
  }

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
        height: 0;
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
        height: 1.5em;
        transition: height 0ms 0ms linear, opacity 200ms 0ms linear, left 200ms,
          top 200ms;
      }
    `;
  }

  render() {
    return html`
      <div class="origin" ${ref(this.origin)}></div>
      <div class="tooltip  ${this.showing ? "-show" : ""}" ${ref(this.tooltip)}>
        ${this.tooltipContent}
      </div>
    `;
  }

  disconnectedCallback() {
    if (this.parentElement) {
      this.parentElement.removeEventListener("mouseout", this.mouseEL);
    }
  }

  setup(nodes) {
    this.nodes = nodes;
    this.parentElement.addEventListener("mouseout", this.mouseEL);
  }
}

customElements.define("togostanza--tooltip", ToolTip);
