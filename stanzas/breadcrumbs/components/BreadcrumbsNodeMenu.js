import { LitElement, html } from "lit";
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
        data-id="breadcrumbs-node-menu"
        class="menu-wrapper"
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
