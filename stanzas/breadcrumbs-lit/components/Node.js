import { LitElement, css, html, nothing, svg } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import roundPathCorners from "../rounding.js";

class Node extends LitElement {
  static get properties() {
    return {
      node: { type: Object, state: true },
      menuItems: { type: Array, state: true },
      showDropdown: {
        type: Boolean,
        state: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        display: block;
      }

      svg {
        cursor: pointer;
      }

      .node-outline {
        stroke: var(--togostanza-border-color);
        stroke-width: 1px;
        fill: transparent;
      }

      .node-label {
        alignment-baseline: middle;
        font-size: calc(var(--togostanza-fonts-font_size_primary));
      }

      .-hover .node-label {
        fill: white;
      }
      .-hover .node-outline {
        fill: green;
      }
    `;
  }

  constructor() {
    super();
    this.node = { label: "", id: "" };
    this.menuItems = [];
    this.showDropdown = false;

    this.svg = createRef();

    this.width = 0;
    this.height = 0;
    this.emW = 0;
    this.emH = 0;

    this.pathD = "";

    this.showMenu = false;
    this.menuShowing = false;
  }

  firstUpdated() {
    const { textWidth, textHeight } = this._getTextRect(this.node.label);
    const { textWidth: emW, textHeight: emH } = this._getTextRect("a");
    this.emW = emW;
    this.emH = emH;
    this.textWidth = textWidth;
    this.textHeight = textHeight;
    this.textMargin = {
      left: 1 * this.emW,
      right: 3 * this.emW,
      top: 0.5 * this.emH,
      bottom: 0.5 * this.emH,
    };
    this.width = this.textWidth + this.textMargin.left + this.textMargin.right;
    this.height =
      this.textHeight + this.textMargin.top + this.textMargin.bottom;
    this.pathD = roundPathCorners(this._getPolygon(), this.emW / 2, 0);

    this.requestUpdate();
  }

  _getPolygon() {
    if (this.width < 20) {
      throw new Error("Width must be greater than arrow length");
    }

    const strokeWidth = 1;

    const WIDTH = this.width - 2 * strokeWidth;
    const HEIGHT = this.height - 2 * strokeWidth;
    const arrowLength = 10;

    const points = [
      [0, 0],
      [WIDTH - arrowLength, 0],
      [WIDTH, HEIGHT / 2],
      [WIDTH - arrowLength, HEIGHT],
      [0, HEIGHT],
    ];

    const path = `M 0,0 L ${points[1].join(",")} L ${points[2].join(
      ","
    )} L ${points[3].join(",")} L ${points[4].join(",")} Z`;

    return path;
  }

  _getTextRect(text) {
    const svg = this.svg.value;
    const textEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    svg.append(textEl);

    textEl.textContent = text;

    const textWidth = textEl.getBBox().width;
    const textHeight = textEl.getBBox().height;
    textEl.remove();

    return { textWidth, textHeight };
  }

  _handleMouseOver() {
    this.svg.value.classList.add("-hover");
    this.showMenu = true;
    this.requestUpdate();
  }

  _unhover() {
    this.svg.value.classList.remove("-hover");
    this.showMenu = false;
    this.requestUpdate();
  }
  _handleMouseOut(e) {
    if (e.relatedTarget.nodeName !== "NODE-MENU") {
      this._unhover();
    }
  }
  _handleMenuLeave() {
    this._unhover();
  }

  render() {
    const nodeG = svg`<g transform="translate(1,1)">
    <path class="node-outline" d="${this.pathD}"></path>
    <text class="node-label" transform="translate(${this.emW},${
      this.height / 2
    })">${this.node.label}</text>
    
  </g>`;

    return html`
      <svg
        @mouseover=${this._handleMouseOver}
        @mouseout=${this._handleMouseOut}
        xmlns="http://www.w3.org/2000/svg"
        width="${this.width}"
        height="${this.height}"
        ${ref(this.svg)}
      >
        ${nodeG}
      </svg>

      ${this.showMenu && this.showDropdown
        ? html`<node-menu
            @menu-leave=${this._handleMenuLeave}
            style="top: ${this.height}px;"
            .menuItems=${this.menuItems}
          ></node-menu>`
        : nothing}
    `;
  }
}

customElements.define("breadcrumbs-node", Node);
