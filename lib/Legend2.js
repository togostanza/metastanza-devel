import { LitElement, html, css } from "lit";
import { createRef, ref } from "lit/directives/ref.js";

export default class Legend2 extends LitElement {
  /**
   *
   * @param {Object[]} items - Array of objects
   * @param {string?} items[].id - id of item
   * @param {string} items[].color - color of item
   * @param {number?} items[].value - label of item
   * @param {Array?} items[].nodes - node of item/ Can be array of nodes
   * @param {Object} options - Options object
   * @param {string?} options.fadeProp - Property to fade out
   * @param {string?} options.position - Position of legend
   * @param {boolean} options.showLeaders - Direction of leader
   */
  constructor() {
    super(...arguments);
    this.items = [];
    this.toggled = [];
    this.options = {};
    this.title = "";
    this._highlightNodeMap = new Map(); // TODO remove
    this._fadeoutNodeMap = new Map();
    this._leaderRef = createRef();
    this.options.fadeProp = this.options.fadeProp ?? "opacity";
    this.options.position = this.options.position ?? ["top", "right"];
  }

  static get properties() {
    return {
      items: { type: Array },
      options: { type: Object },
      toggled: { type: Array },
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .legend {
        padding: 3px 9px;
        display: inline-block;
        vertical-align: top;
        max-width: 25em;
        max-height: 100%;
        font-size: 10px;
        line-height: 1.5;
        overflow-y: auto;
        color: var(--togostanza-fonts-font_color);
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
      }
      .legend > table > tbody > tr > td > .marker {
        display: block;
        border-radius: 100%;
        margin: 0 auto;
        border: calc(var(--togostanza-border-width) * 1px) solid
          var(--togostanza-border-color);
      }
      .legend > table > tbody > tr > td + td > span {
        margin-left: 0.3em;
      }

      .legend > table > tbody > tr > td.number {
        text-align: right;
      }

      .legend > .title {
        font-size: var(--togostanza-fonts-font_size_secondary);
      }
      .leader {
        position: absolute;
        border-left: dotted 1px black;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
      }
      .leader[data-direction="top"] {
        border-top: dotted 1px black;
      }
      .leader[data-direction="bottom"] {
        border-bottom: dotted 1px black;
      }
      .leader.-show {
        opacity: 0.5;
      }
      .toggled {
        opacity: 0.5;
      }
    `;
  }

  render() {
    return html`
      <div class="origin"></div>
      <div class="legend">
        ${this.title && html`<h2 class="title">${this.title}</h2>`}
        <table>
          <tbody
            @mouseover="${this._mouseOverHandler}"
            @mouseout="${this._mouseOutHandler}"
            @click="${this._clickHandler}"
          >
            ${this.items.map((item) => {
              return html` <tr data-id="${item.id}">
                <td class="${item.toggled ? "toggled" : ""}">
                  <span
                    class="marker"
                    style="background-color: ${item.color}; width: ${item.size
                      ? item.size + "px"
                      : "1em"};  height: ${item.size
                      ? item.size + "px"
                      : "1em"}"
                  ></span>
                </td>
                ${item.value
                  ? html`<td class="${(typeof item.value).toLowerCase()}">
                      <span>${item.value}</span>
                    </td>`
                  : ""}
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
      <div class="leader" ${ref(this._leaderRef)}></div>
    `;
  }

  _mouseOverHandler(e) {
    if (this.items.length) {
      e.stopPropagation();
      const targetRow = e.target.closest("tr");
      const nodeId = targetRow.dataset.id;

      if (this._highlightNodeMap.has(nodeId)) {
        const nodesToHighlight = this._highlightNodeMap.get(nodeId);
        const nodesToFadeout = this._fadeoutNodeMap.get(nodeId);

        nodesToHighlight.forEach((node) => {
          node.classList.add("-highlight");
          node.classList.remove("-fadeout");
        });
        nodesToFadeout.forEach((node) => {
          node.classList.remove("-highlight");
          node.classList.add("-fadeout");
        });

        if (this.options.showLeaders) {
          this._leaderRef.value.classList.add("-show");
          const originRect = this.renderRoot
            .querySelector(".origin")
            .getBoundingClientRect();
          const legendRect = e.target.getBoundingClientRect();
          const targetRect = nodes.getBoundingClientRect();
          this._leaderRef.value.style.left =
            targetRect.x + targetRect.width * 0.5 - originRect.x + "px";
          this._leaderRef.value.style.width =
            legendRect.x - targetRect.right + targetRect.width * 0.5 + "px";
          const legendMiddle = legendRect.y + legendRect.height * 0.5;
          const targetMiddle = targetRect.y + targetRect.height * 0.5;
          if (legendMiddle < targetMiddle) {
            this._leaderRef.value.dataset.direction = "top";
            this._leaderRef.value.style.top =
              legendMiddle - originRect.y + "px";
            this._leaderRef.value.style.height =
              targetMiddle - legendMiddle + "px";
          } else {
            this._leaderRef.value.dataset.direction = "bottom";
            this._leaderRef.value.style.top =
              targetMiddle - originRect.y + "px";
            this._leaderRef.value.style.height =
              legendMiddle - targetMiddle + "px";
          }
        }
      }
    }
  }

  _mouseOutHandler(e) {
    e.stopPropagation();

    this.items
      .flatMap((item) => item.nodes)
      .forEach((node) => {
        node.classList.remove("-highlight");
        node.classList.remove("-fadeout");
      });

    if (this.options.showLeaders) {
      this._leaderRef.value.classList.remove("-show");
    }
  }

  _clickHandler(e) {
    if (this.items.length) {
      this.renderRoot.dispatchEvent(
        new CustomEvent("legend-item-click", {
          bubbles: true,
          composed: true,
          detail: {
            label: this.items.find((item) => item.id === e.target.dataset.id)
              ?.label,
          },
        })
      );
    }
  }

  setup(params) {
    for (const [key, value] of Object.entries(params)) {
      this[key] = value;
    }
  }

  willUpdate(changed) {
    if (
      changed.has("items") &&
      this.items.length &&
      this.items.some((item) => item.nodes)
    ) {
      this.items.forEach((item) => {
        this._highlightNodeMap.set(item.id, item.nodes);
        this._fadeoutNodeMap.set(
          item.id,
          this.items
            .filter((otherItem) => item.id !== otherItem.id)
            .flatMap((item) => item.nodes)
        );
      });
    }
  }
}

customElements.define("togostanza--legend2", Legend2);
