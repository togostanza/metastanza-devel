import { LitElement, html, css, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";

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
        border: 1px solid red;
        padding-top: 5px;
      }
      .menu-triangle {
        top: -3px;
        width: 6px;
        height: 6px;
        position: absolute;
        left: 50%;
        transform: rotate(45deg);
        border: 1px solid blue;
        z-index: 0;
      }
      .menu-triangle-overlay {
        top: -3px;
        width: 5px;
        height: 5px;
        position: absolute;
        left: 50%;
        transform: rotate(45deg);
        background-color: #333;
        z-index: 1;
      }
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
    `;
  }

  constructor() {
    super();
    this.menuItems;
  }

  _handleMouseEnter() {
    this.dispatchEvent(new CustomEvent("menu-hover"));
  }
  _handleMouseLeave() {
    this.dispatchEvent(new CustomEvent("menu-leave"));
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
        <ul class="menu-container">
          ${repeat(
            this.menuItems,
            (d) => d.label,
            (d) => html` <li>${d.label}</li> `
          )}
        </ul>
      </div>
    `;
  }
}

customElements.define("node-menu", Menu);
