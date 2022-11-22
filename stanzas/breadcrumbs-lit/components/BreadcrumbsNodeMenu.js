import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";

class Menu extends LitElement {
  static get properties() {
    return {
      menuItems: {
        type: Array,
        state: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        left: 0;
      }

      .menu-wrapper {
        padding-top: 5px;
      }

      .menu-triangle {
        position: relative;
        top: 0;
        width: 7px;
        height: 7px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 2px) rotate(45deg);
        border: 1px solid var(--togostanza-border-color);
        z-index: 1;
      }

      .menu-triangle-overlay {
        position: relative;
        top: 0;
        width: 7px;
        height: 7px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 3px) rotate(45deg);
        background-color: var(--togostanza-node-background_color);
        z-index: 5;
        clip-path: polygon(100% 0, 0 0, 0 100%);
      }

      .menu-container {
        position: relative;
        max-width: 15em;
        margin: 0;
        border: 1px solid var(--togostanza-border-color);
        border-radius: 0.5em;
        background-color: var(--togostanza-node-background_color);
        z-index: 3;
        cursor: pointer;
      }

      ul.menu-items {
        max-height: 20em;
        margin: 0.2em 0;
        padding: 0;
        overflow-y: auto;
        list-style-type: none;
      }

      li {
        display: block;
        line-height: 1.2;
        padding: 0.5em;
        word-wrap: break-word;
      }

      li:hover {
        background-color: var(--togostanza-node-background_color_hover);
        color: var(--togostanza-fonts-font_color_hover);
      }

      li:active {
        filter: brightness(0.93);
      }
    `;
  }

  constructor() {
    super();
    this.menuItems = [];
  }

  _handleMouseLeave() {
    this.dispatchEvent(
      new CustomEvent("menu-leave", { composed: true, bubbles: true })
    );
  }
  _handleClick(id) {
    this.dispatchEvent(
      new CustomEvent("menu-item-clicked", {
        detail: { id },
        bubbles: true,
        composed: true,
      })
    );
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div
        class="menu-wrapper"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="menu-triangle"></div>
        <div class="menu-triangle-overlay"></div>
        <div class="menu-container">
          <ul class="menu-items">
            ${map(
              this.menuItems,

              (d) =>
                html`
                  <li
                    @click=${(e) => {
                      e.stopPropagation();
                      this._handleClick(d.id);
                    }}
                  >
                    ${d.label}
                  </li>
                `
            )}
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define("breadcrumbs-node-menu", Menu);
