import { LitElement, html, nothing, svg } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import roundPathCorners from "../rounding.js";
import * as FAIcons from "@fortawesome/free-solid-svg-icons";

class Node extends LitElement {
  static get properties() {
    return {
      node: { type: Object, state: true },
      menuItems: { type: Array, state: true },
      showDropdown: {
        type: Boolean,
        state: true,
      },
      iconName: { type: String, state: true },
      mode: { type: String },
    };
  }

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.node = { label: "", id: "" };
    this.menuItems = [];
    this.showDropdown = false;
    this.iconName = "";
    this.icon = null;
    this.mode = "node";

    this.svg = createRef();

    this.width = 0;
    this.height = 0;
    this.iconMarginLeft = 0;
    this.iconWidth = 0;
    this.emW = 0;
    this.emH = 0;
    this.textMargin = { left: 0, right: 0, top: 0, bottom: 0 };

    this.pathD = "";

    this.showMenu = false;

    this.arrowWidth = 2;
  }

  willUpdate() {
    if (!this.svg.value) {
      this.svg.value = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      this.svg.value.setAttribute("width", 0);
      this.svg.value.setAttribute("height", 0);
      this.renderRoot.append(this.svg.value);
    }

    if (this.mode === "invisible") {
      this.renderRoot.style = "position: absolute; visibility: hidden";
    }

    this.icon = FAIcons[`fa${this.iconName}`]?.icon;

    let { textWidth, textHeight } = this._getTextRect(this.node.label);

    if (textHeight === 0) {
      textHeight = this._getTextRect("W").textHeight;
      textWidth = 0;
    }

    const { textWidth: emW, textHeight: emH } = this._getTextRect("a");
    this.emW = emW;
    this.emH = emH;
    this.textWidth = textWidth;
    this.textHeight = textHeight;
    const textMarginLeft = 1 * this.emW;

    if (this.icon) {
      this.iconMarginLeft = 1 * this.emW;
      this.iconWidth = (this.emH * this.icon[0]) / this.icon[1];
    }

    this.textMargin = {
      left: textMarginLeft + this.iconMarginLeft + this.iconWidth,
      right: 3 * this.emW,
      top: 0.5 * this.emH,
      bottom: 0.5 * this.emH,
    };

    if (this.mode === "node") {
      this.width =
        this.textWidth + this.textMargin.left + this.textMargin.right;
    } else {
      this.width = this.iconWidth + this.iconMarginLeft * 2;
    }

    this.height =
      this.textHeight + this.textMargin.top + this.textMargin.bottom;
    this.pathD = roundPathCorners(this._getPolygon(), this.emW / 2, 0);
  }

  _getPolygon() {
    if (this.width < this.emW * 2 && this.mode !== "invisible") {
      throw new Error("Width must be greater than arrow length");
    }

    const strokeWidth = 1;

    const WIDTH = this.width - 2 * strokeWidth;
    const HEIGHT = this.height - 2 * strokeWidth;

    let points;
    if (this.mode === "node") {
      const arrowLength = this.emW * 2;

      points = [
        [WIDTH - arrowLength, 0],
        [WIDTH, HEIGHT / 2],
        [WIDTH - arrowLength, HEIGHT],
        [0, HEIGHT],
      ];
    } else {
      points = [
        [WIDTH, 0],
        [WIDTH, HEIGHT],
        [0, HEIGHT],
      ];
    }

    const Lpath = points.map((p) => `L ${p.join(",")}`);

    const path = `M 0,0 ${Lpath} Z`;

    return path;
  }

  _getTextRect(text) {
    if (!text) {
      return { textWidth: 0, textHeight: 0 };
    }

    const textEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    this.svg.value.append(textEl);

    textEl.textContent = text;

    const textWidth = textEl.getBBox().width;
    const textHeight = textEl.getBBox().height;
    this.svg.value.removeChild(textEl);

    return { textWidth, textHeight };
  }

  _getIcon() {
    if (!this.icon) {
      return nothing;
    } else {
      return html`
        <svg viewBox="0 0 ${this.icon[0]} ${this.icon[1]}" height="${this.emH}">
          ${svg`<path d="${this.icon[4]}"></path>`}
        </svg>
      `;
    }
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
    if (
      e.relatedTarget &&
      e.relatedTarget.dataset["id"] !== "breadcrumbs-node-menu"
    ) {
      this._unhover();
    }
  }
  _handleMenuLeave() {
    this._unhover();
  }

  render() {
    const nodeG = svg`<g transform="translate(1,1)">
    <path class="node-outline" d="${this.pathD}"></path>
    ${
      this.icon
        ? svg`<g class="home-icon" transform="translate(${
            -this.width / 2 + this.iconWidth / 2 + this.iconMarginLeft
          },${this.height / 2 - 0.7 * this.emH})">
    ${this._getIcon()}
    </g>`
        : nothing
    }
    ${svg`<text class="node-label" transform="translate(${
      this.textMargin.left
    },${this.height / 2})">${this.node.label}</text>`}

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
        ${this.node.url
          ? svg`<a href="${this.node.url}" target="_blank">${nodeG}</a>`
          : nodeG}
      </svg>

      ${this.showMenu && this.showDropdown && this.menuItems.length > 0
        ? html`<breadcrumbs-node-menu
            @menu-leave=${this._handleMenuLeave}
            style="top: ${this.height}px;"
            .menuItems=${this.menuItems}
          ></breadcrumbs-node-menu>`
        : nothing}
    `;
  }
}

customElements.define("breadcrumbs-node", Node);
