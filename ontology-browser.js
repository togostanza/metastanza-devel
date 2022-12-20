import { k as e, j as i, t, a9 as x, h as b, a as s$1, a8 as i$1, y, S as Stanza, d as defineStanzaElement } from './transform-237e281d.js';
import { f as appendCustomCss } from './index-86482d2c.js';
import { s as spinner } from './spinner-0571803e.js';
import { a as axios } from './axios-70c5a559.js';
import { m, u as u$1, r, p, s, c as c$1, e as e$1, n, o } from './ref-31a5cf03.js';

/** Cached axios */
class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(maxCacheSize = 100) {
    this.axios = axios.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    this.maxCacheSize = maxCacheSize;
    this.cache = new Map();
  }

  /**
   *
   * @param {string} url - url part bo be fetched. Fetched url will be  baseURL + url
   * @returns {object} {data} - response data
   */
  get(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.get(url).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (Object.keys(res.data).length === 0) {
        throw new Error("Empty response from API");
      }

      this.cache.set(url, { data: res.data });
      if (this.cache.size > this.maxCacheSize) {
        const [first] = this.cache.keys();
        this.cache.delete(first);
      }
      return { data: res.data };
    });
  }
}

function getByPath(object, path) {
  if (!path) {
    return object;
  }

  const pathArr = path.split(".");
  let res = object[pathArr[0]];

  for (const path of pathArr.slice(1)) {
    if (!res) {
      return undefined;
    }
    res = res[path];
  }
  return res;
}

function camelize(s) {
  return s.replace(/[-_]./g, (x) => x[1].toUpperCase());
}

function applyConstructor(params) {
  for (const param in params) {
    this[camelize(param)] = params[param] || undefined;
  }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e(class extends i{constructor(e){if(super(e),e.type!==t.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.ht(e,s,t).values}update(s$1,[t,r$1,c]){var d;const a=m(s$1),{values:p$1,keys:v}=this.ht(t,r$1,c);if(!Array.isArray(a))return this.ut=v,p$1;const h=null!==(d=this.ut)&&void 0!==d?d:this.ut=[],m$1=[];let y,x$1,j=0,k=a.length-1,w=0,A=p$1.length-1;for(;j<=k&&w<=A;)if(null===a[j])j++;else if(null===a[k])k--;else if(h[j]===v[w])m$1[w]=u$1(a[j],p$1[w]),j++,w++;else if(h[k]===v[A])m$1[A]=u$1(a[k],p$1[A]),k--,A--;else if(h[j]===v[A])m$1[A]=u$1(a[j],p$1[A]),r(s$1,m$1[A+1],a[j]),j++,A--;else if(h[k]===v[w])m$1[w]=u$1(a[k],p$1[w]),r(s$1,a[j],a[k]),k--,w++;else if(void 0===y&&(y=u(v,w,A),x$1=u(h,j,k)),y.has(h[j]))if(y.has(h[k])){const e=x$1.get(v[w]),t=void 0!==e?a[e]:null;if(null===t){const e=r(s$1,a[j]);u$1(e,p$1[w]),m$1[w]=e;}else m$1[w]=u$1(t,p$1[w]),r(s$1,a[j],t),a[e]=null;w++;}else p(a[k]),k--;else p(a[j]),j++;for(;w<=A;){const e=r(s$1,m$1[A+1]);u$1(e,p$1[w]),m$1[w++]=e;}for(;j<=k;){const e=a[j++];null!==e&&p(e);}return this.ut=v,s(s$1,m$1),x}});

const disconnectedRects = new Map();
class Flip extends c$1 {
  constructor() {
    super();

    this.parent = undefined;
    this.element = undefined;
    this.boundingRect = undefined;
    this.id = undefined;
    this.role = "";
    this.parentRect = null;
  }

  render() {
    return b;
  }

  update(
    part,
    [
      {
        id = undefined,
        role = "",
        options = {},
        heroId = undefined,
        scrolledHeroRect = null,
      } = {},
    ]
  ) {
    this.id = id;
    this.role = role;
    this.heroId = heroId;

    this.scrolledHeroRect = scrolledHeroRect;

    // for column wich became hero, remove all other nodes from it
    // TODO not working for now (deleting nodes with animation)
    if (
      this.role === "hero" &&
      this.id !== this.heroId &&
      this.id !== "dummy"
    ) {
      disconnectedRects.set(this.id, part.getBoundingClientRect());
      this.remove();
    }

    // for new nodes in non-hero columns, slide them from 0 to their positions
    if (this.role !== "hero" && !disconnectedRects.has(this.id)) {
      disconnectedRects.set(this.id, { y: 0, x: 0, width: 0, height: 0 });
    }

    this.options = {
      ...this.options,
      ...options,
    };

    if (this.element !== part.element) {
      this.element = part.element;

      this.parent =
        this.element.parentElement ||
        this.element.getRootNode().querySelector(".column");
    }

    // memorize boundingRect before element updates
    if (this.boundingRect) {
      this.boundingRect = this.element.getBoundingClientRect();
    }
    // the timing on which LitElement batches its updates, to capture the "last" frame of our animation.
    Promise.resolve().then(() => this.prepareToFlip());
    return x;
  }

  prepareToFlip() {
    if (!this.boundingRect) {
      this.boundingRect = disconnectedRects.has(this.id)
        ? disconnectedRects.get(this.id)
        : this.element.getBoundingClientRect();
      disconnectedRects.delete(this.id);
    }

    this.flip();
  }

  flip(listener, removing) {
    let previous = this.boundingRect;

    if (this.id === this.heroId) {
      previous = this.scrolledHeroRect;
      this.boundingRect = this.element.parentElement.getBoundingClientRect();
    } else {
      this.boundingRect = this.element.getBoundingClientRect();
    }

    this.boundingRect = this.element.getBoundingClientRect();

    const deltaY = (previous?.y || 0) - (this.boundingRect?.y || 0);

    if (!deltaY && !removing) {
      return;
    }

    const filteredListener = (event) => {
      if (event.target === this.element) {
        listener(event);
        this.element.removeEventListener("transitionend", filteredListener);
      }
    };

    this.element.addEventListener("transitionend", filteredListener);

    this.element.animate(
      [
        {
          transform: `translate(0, ${deltaY}px)`,
        },
        {
          transform: `translate(0,0)`,
        },
      ],
      this.options
    );
  }

  remove() {
    this.element.animate(
      [
        {
          opacity: 1,

          transform: `translateY(0)`,
        },
        {
          opacity: 0,

          transform: `translateY(${
            this.element.getBoundingClientRect().y + 200
          }px)`,
        },
      ],
      this.options
    ).onfinish = () => {
      if (disconnectedRects.has(this.id)) {
        disconnectedRects.delete(this.id);
      }
      this.element.remove();
    };
  }

  disconnected() {
    if (this.role === "hero") {
      this.remove();
      return;
    }
    this.boundingRect = this.element.getBoundingClientRect();
    if (typeof this.id !== "undefined") {
      disconnectedRects.set(this.id, this.boundingRect);
      requestAnimationFrame(() => {
        if (disconnectedRects.has(this.id)) {
          this.remove();
        }
      });
    }
  }
}

const flip = e(Flip);

class OntologyCard extends s$1 {
  static get styles() {
    return i$1`
    :host {
      display: block;
      position: relative;
      --default-bg-color: white;
      font-family: var(--togostanza-fonts-font_family);
      font-size: var(--togostanza-fonts-font_size_primary);
      color: var(--togostanza-fonts-font_color);
    }

    .-hero-right:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left-1:after {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      right: 0;
      transform: translate(50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    .-children-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-left: 1px solid var(--togostanza-border-color);
      bottom: -6px;
      box-sizing: border-box;
    }

    .-children-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-left: 1px solid var(--togostanza-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top:  1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-left: 1px solid var(--togostanza-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-right: 1px solid var(--togostanza-border-color);
      bottom: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-right: 1px solid var(--togostanza-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-right: 1px solid var(--togostanza-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-single:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-single:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .ontology-card {
      padding: 10px;
      font-family: var(--togostanza-font-family);
      border: 1px solid var(--togostanza-border-color);
      border-radius: 8px;
      background-color: var(--togostanza-node-bg-color);
      cursor: pointer;
      position: relative;
      width: min(85%, 20rem);
      max-width: 30rem;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .ontology-card:hover {
      filter: brightness(0.98)
    }

    .children-arrow {
      overflow: visible;
    }

    .children-arrow-1:before {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-border-color);
      top: min(50%, 15px);
      left: 0;
      transform: translate(-50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    h3 {
      display: inline;
      margin: 0;
      font-size: var(--togostanza-fonts-font_size_primary);
    }

    .card-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .connector {
      position: relative;
      flex-grow: 1;
    }

    .selected {
      background-color: var(--togostanza-node-bg-color_selected);
      border-color: var(--togostanza-border-color_selected);
    }

    .hidden {
      visibility: hidden;
    }

    .table-container {
      overflow-y: auto;
    }

    .hero-list {
      padding-inline-start: 1rem;
    }

    .hero-list li {
      margin-left: 0.5rem;
    }

    table {
      width: 100%
      max-width: 10rem;
      table-layout: fixed;
      font-size: var(--togostanza-fonts-font_size_secondary)
    }

    table td.key {
      vertical-align: top;
      font-style: italic;
    }

    table td.data {
      overflow: auto;
      display: inline-block;
    }
  `;
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      hidden: { type: Boolean, attribute: true },
      id: { type: String, attribute: true, reflect: true },
      mode: {
        type: String,
        state: true,
      },
      order: {
        type: String,
        state: true,
      },
      prevRect: {
        type: Object,
        state: true,
      },
      content: {
        type: Object,
        state: true,
      },
    };
  }

  shouldUpdate() {
    if (this.data.id === "dummy") {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    return true;
  }

  constructor() {
    super();
    this.data = {};
    this.hidden = false;
    this.mode = "";
    this.order = "";
    this.prevRect = { x: 0, y: 0, width: 0, height: 0 };
    this._skipKeys = ["label", "children", "parents", "leaf", "root"];
    this.cardRef = e$1();
    this._leftCoinnector = e$1;
    this.leftConnectorClassName = "";
    this.rightConnectorClassName = "";
    this.content = {};
  }

  willUpdate(prevParams) {
    if (this.mode === "hero") {
      // do not display connection liner to right of hero node without children and to left of hero node without parents
      if (this.data.leaf) {
        this.leftConnectorClassName = "-hero-left";
      } else if (this.data.root) {
        this.rightConnectorClassName = "-hero-right";
      } else {
        this.leftConnectorClassName = `-hero-left`;
        this.rightConnectorClassName = `-hero-right`;
      }
    } else if (this.mode === "children") {
      this.leftConnectorClassName = `-${this.mode}-${this.order}`;
    } else if (this.mode === "parents") {
      this.rightConnectorClassName = `-${this.mode}-${this.order}`;
    }

    this.prevMode = prevParams.get("mode");
    if (this.data.id === "dummy") {
      this.leftConnectorClassName = "";
      this.rightConnectorClassName = "";
    }
  }

  updated() {
    const animProps = {
      duration: 500,
      easing: "ease-out",
    };
    if (this.mode === "hero") {
      const animation = [
        {
          height: `${this.prevRect?.height || 0}px`,
          overflow: "hidden",
        },
        {
          height: `${
            this.cardRef?.value.getBoundingClientRect().height || 0
          }px`,
        },
      ];

      animation[0].backgroundColor = this.defaultBgColor;
      animation[1].backgroundColor = this.selectedBgColor;

      this.cardRef.value.animate(animation, animProps);
    }
  }

  firstUpdated() {
    this.defaultBgColor = getComputedStyle(this.cardRef.value).getPropertyValue(
      "--default-bg-color"
    );
    this.selectedBgColor = getComputedStyle(
      this.cardRef.value
    ).getPropertyValue("--selected-bg-color");
  }

  render() {
    return y`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${n(this.cardRef)}
          class="ontology-card ${this.hidden ? "hidden" : ""} ${this.mode ===
          "hero"
            ? "selected"
            : ""} ${this.mode === "children" ? "children-arrow" : ""}"
        >
          <h3>${this.data.label || "..."}</h3>
          ${this.mode === "hero"
            ? y`
                <div class="table-container">
                  <table>
                    <tbody>
                      ${this.data.showDetailsKeys?.map((key) => {
                        return y`
                          <tr>
                            <td class="key">${key}</td>
                            <td class="data">
                              ${this.data[key] instanceof Array
                                ? y`<ul class="hero-list">
                                    ${this.data[key].map(
                                      (item) => y`<li>${item}</li> `
                                    )}
                                  </ul>`
                                : this.data[key]}
                            </td>
                          </tr>
                        `;
                      })}
                    </tbody>
                  </table>
                </div>
              `
            : b}
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define("ontology-card", OntologyCard);

class OntologyBrowserColumn extends s$1 {
  static get styles() {
    return i$1`
      :host {
        flex-grow: 1;
        flex-basis: 0;
        display: block;
        position: relative;
      }

      .column {
        height: 100%;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: calc(
          var(--togostanza-outline-height) - var(--history-height)
        );
      }
    `;
  }

  static get properties() {
    return {
      nodes: { type: Array, state: true },
      role: { type: String, state: true },
      heroId: {
        type: String,
        state: true,
      },
      scrolledHeroRect: { type: Object, state: true },
      animationOptions: { type: Object, state: true },
    };
  }
  constructor() {
    super();
    this.nodes = []; // array of nodes in children / parents, or [details]
    this.heroId = undefined;
    this.role = "";
    this.scrolledHeroRect = null;
    this.animationOptions = {};
    this.idNodeMap = new Map();
  }

  willUpdate(changed) {
    if (changed.has("nodes")) {
      this.nodes.forEach((node) => {
        this.idNodeMap.set(node.id, node);
      });
    }
    if (changed.has("heroId")) {
      this.previousHeroId = changed.get("heroId");
    }
  }

  _handleClick(e) {
    if (e.target.tagName === "ONTOLOGY-CARD") {
      // only if clicked on the card itself, not on connector div
      if (!e.path[0].classList.contains("connector") && this.role !== "hero") {
        // dispatch event to load new data by id
        this.dispatchEvent(
          new CustomEvent("column-click", {
            detail: {
              role: this.role,
              rect: e.target.getBoundingClientRect(),
              ...this.idNodeMap.get(e.target.id),
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  render() {
    return y`
      <div
        class="column"
        @click="${this.nodes[0].id === "dummy" ? null : this._handleClick}"
      >
        ${this.nodes.length
          ? y`
              ${c(
                this.nodes,
                (node) => node.id,
                (node, index) => {
                  return y`<ontology-card
                    key="${node.id}"
                    id="${node.id}"
                    .data=${node}
                    .mode=${this.role}
                    .prevRect=${this.scrolledHeroRect}
                    .order=${this.nodes.length === 1
                      ? "single"
                      : index === 0
                      ? "first"
                      : index === this.nodes.length - 1
                      ? "last"
                      : "mid"}
                    ${flip({
                      id: node.id,
                      heroId: this.heroId,
                      previousHeroId: this.previousHeroId,
                      role: this.role,
                      scrolledHeroRect: this.scrolledHeroRect,
                      options: this.animationOptions,
                    })}
                  />`;
                }
              )}
            `
          : b}
      </div>
    `;
  }
}

customElements.define("ontology-browser-column", OntologyBrowserColumn);

class OntologyBrowserView extends s$1 {
  static get styles() {
    return i$1`
      :host {
        font-size: 10px;
        display: block;
        height: 100%;
      }

      .clip {
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      .flex {
        height: 100%;
        display: flex;
        flex-direction: row;
      }
    `;
  }

  constructor() {
    super();
    this.flexRef = e$1();
    this.clipRef = e$1();
    this.nodeRef = e$1();
    this.movement = "";
    this.flexWidth = 0;
    this.deltaWidth = 0;
    this.nodeWidth = 0;
    this.gap = 0;
    this.animate = null;
    this.scrolledRect = null;

    this.dataColumns = {
      _parents: [],
      parents: [],
      hero: [],
      children: [],
      _children: [],
    };
    this.animationOptions = {
      duration: 500,
      easing: "ease-in-out",
    };

    this._id = "";
    this._columns = ["parents", "hero", "children"];
    this.data = {};
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      _columns: {
        type: Array,
        state: true,
      },
    };
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("data")) {
      if (changedProperties.get("data")) {
        if (
          this.data.details.id &&
          changedProperties.get("data").details?.id !== this.data.details.id
        ) {
          // parents before update
          this.dataColumns._parents = changedProperties.get("data").relations
            ?.parents || [{ id: "dummy", label: "dummy" }];
          // children before update
          this.dataColumns._children = changedProperties.get("data").relations
            ?.children || [{ id: "dummy", label: "dummy" }];

          if (this._columns.length === 4) {
            let movement;
            if (this._columns.includes("_parents")) {
              movement = "left";
            } else if (this._columns.includes("_children")) {
              movement = "right";
            } else {
              movement = "";
            }

            // hero before update
            if (movement === "left") {
              this.dataColumns.hero = this.dataColumns._children;
            } else if (movement === "right") {
              this.dataColumns.hero = this.dataColumns._parents;
            }
          } else {
            this.dataColumns.hero = [
              {
                ...this.data.details,
                leaf:
                  !this.data.relations?.children ||
                  !this.data.relations?.children.length,
                root:
                  !this.data.relations?.parents ||
                  !this.data.relations?.parents.length,
              },
            ];
          }

          //parents after update
          this.dataColumns.parents = this.data.relations?.parents || [];
          //children after update
          this.dataColumns.children = this.data.relations?.children || [];
        }
      }

      this.updateComplete.then(() => {
        if (this.data.role === "children") {
          this.movement = "left";

          this._columns = ["_parents", "parents", "hero", "children"];
        } else if (this.data.role === "parents") {
          this.movement = "right";

          this._columns = ["parents", "hero", "children", "_children"];
        }
      });
    }
    if (changedProperties.has("_columns")) {
      this.nodeWidth =
        this.nodeRef.value?.getBoundingClientRect().width -
          (this.nodeRef.value?.getBoundingClientRect().right -
            this.clipRef.value?.getBoundingClientRect().right) || 0;
      this.gap =
        (this.clipRef.value?.getBoundingClientRect().width -
          this.nodeWidth * 3) /
        2;

      this.flexWidth =
        this._columns.length === 4
          ? this.nodeWidth * this._columns.length +
            (this._columns.length - 1) * this.gap +
            "px"
          : "100%";

      this.deltaWidth = this.nodeWidth + this.gap;
    }
  }

  _handleClick(e) {
    if (e.target?.role === "parents" || e.target?.role === "children") {
      this.scrolledRect = e.detail?.rect || null;
    }
  }

  updated() {
    if (this.movement === "left") {
      this.animate = this.flexRef.value.animate(
        [
          { transform: "translateX(0)" },
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
        ],
        this.animationOptions
      );
    } else if (this.movement === "right") {
      this.animate = this.flexRef.value.animate(
        [
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
          { transform: "translateX(0)" },
        ],
        this.animationOptions
      );
    }

    if (this.animate) {
      this.animate.onfinish = () => {
        this.movement = "";
        this._columns = ["parents", "hero", "children"];
        this.animate = null;
      };
    }
  }

  render() {
    return y`
      <div class="clip" ${n(this.clipRef)}>
        <div
          class="flex"
          @column-click="${this._handleClick}"
          style="width: ${this.flexWidth}"
          ${n(this.flexRef)}
        >
          ${c(
            this._columns,
            (column) => column,
            (column) => {
              return y`
                <ontology-browser-column
                  .role="${column}"
                  .nodes="${this.dataColumns[column].length
                    ? this.dataColumns[column]
                    : [{ id: "dummy", label: "dummy" }]}"
                  ${n(this.nodeRef)}
                  .heroId="${this.data.details?.id}"
                  .scrolledHeroRect="${this.scrolledRect}"
                  .animationOptions="${this.animationOptions}"
                ></ontology-browser-column>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-view", OntologyBrowserView);

class OntologyError extends s$1 {
  static get styles() {
    return i$1`
      .error-wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        z-index: 11;
      }

      .error-container {
        width: max(50%, 15rem);
        min-width: 5rem;
        background-color: var(--togostanza-node-bg-color);
        border-radius: 15px;
        padding: 0 1rem;
        border: 1px solid var(--togostanza-node-border-color);
      }

      h3 {
        margin-top: 0.8rem;
      }
    `;
  }

  static get properties() {
    return {
      message: {
        type: String,
        attribute: "message",
      },
    };
  }

  constructor() {
    super();
    this.message = "";
  }

  render() {
    return y`
      <div class="error-wrapper">
        <div class="error-container">
          <h3>Error</h3>
          <p>${this.message}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-error", OntologyError);

class OntologyPath extends s$1 {
  constructor() {
    super();
    this.path = [];
    this._container = e$1();
    this.selectedNodeId = "";
  }

  static get styles() {
    return i$1`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        heigth: var(--history-height);
      }

      .path-header {
        display: block;
        font-size: var(--togostanza-fonts-font_size_primary);
        margin: 0;
        padding: 0;
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
        max-width: calc(100% - (100% / 3 - 30rem));
      }

      .path-container {
        white-space: nowrap;
        overflow-x: scroll;
        display: flex;
        gap: 0.2em;
        align-items: center;
        justify-content: flex-start;
        height: 5rem;
        max-width: calc(100% - (100% / 3 - 30rem));
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
      }

      .node {
        cursor: pointer;
        display: inline-block;
        font-size: var(--togostanza-fonts-font_size_secondary);
        padding: 0 0.6em;
        width: 10em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .node-container {
        display: block;
        position: relative;
        margin-right: -3em;
        transform: rotate(340deg);
      }

      .node-container:before {
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        border: 1px solid var(--togostanza-border-color);
        position: absolute;
        border-radius: 50%;
        bottom: 0;
      }

      .node-container + .node-container:after {
        content: "";
        display: block;
        width: 2.35em;
        height: 1px;
        border-bottom: 1px solid var(--togostanza-border-color);
        transform: rotate(200deg);
        transform-origin: left bottom;
        box-sizing: border-box;
        position: absolute;
        bottom: 0.25em;
      }

      .node:hover {
        filter: brightness(1.05);
      }

      .-active {
        font-weight: bold;
      }
    `;
  }

  static get properties() {
    return {
      path: { type: Array, state: true },
      selectedNodeId: { type: String, state: true },
    };
  }

  _nodeClickHandler(e) {
    if (e.target.classList.contains("node")) {
      this.selectedNodeId = e.target.id;
      const selectedNodeId = e.target.id.match(/(^.+(?=-))/g)[0];

      this.dispatchEvent(
        new CustomEvent("history-clicked", {
          detail: {
            id: selectedNodeId,
          },
          composed: true,
        })
      );
    }
  }

  updated(changed) {
    if (changed.get("path")) {
      this._container.value.scrollLeft = this._container.value.scrollWidth;
    }
  }

  render() {
    return y`
      <div class="container">
        <h2 class="path-header">History</h2>
        <div
          class="path-container"
          @click="${this._nodeClickHandler}"
          ${n(this._container)}
        >
          ${o(this.path, (node, i) => {
            const id = `${node.id}-${i}`;
            return y`<span class="node-container">
              <span
                id="${id}"
                class="node ${id === this.selectedNodeId ? "-active" : ""}"
                title="${node.label}"
                >${node.label}</span
              >
            </span>`;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-path", OntologyPath);

class OntologyBrowser extends s$1 {
  static get styles() {
    return i$1`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .spinner {
        z-index: 10;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      ontology-error {
        z-index: 11;
      }

      .spinner > img {
        display: block;
        width: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
  }

  static get properties() {
    return {
      diseaseId: {
        type: String,
        reflect: true,
      },
      data: { state: true },
      loading: { type: Boolean, state: true },
      error: { type: Object, state: true },
      clickedRole: {
        type: String,
        status: true,
      },
      apiEndPoint: {
        type: String,
        state: true,
      },
      showKeys: {
        type: Array,
        state: true,
      },
      pathArray: {
        type: Array,
        state: true,
      },
      activeNode: {
        type: Object,
        state: true,
      },
    };
  }

  constructor(element) {
    super();
    this._timer = null;

    element.append(this);

    this.data = [];
    this.loading = false;
    this.clickedRole = undefined;
    this.diseaseId = undefined;
    this.apiEndpoint = "";
    this.error = { message: "", isError: false };
    this.showKeys = ["id", "label"];
    this.pathArray = [];
    this.activeNode = {};

    this.historyClicked = false;

    this.API = new cachedAxios();
  }

  updateParams(params) {
    try {
      this._validateParams(params);

      applyConstructor.call(this, params);

      this.showKeys = this.nodeDetailsShowKeys
        ? this.nodeDetailsShowKeys.split(",").map((key) => key.trim())
        : [];

      this.error = { message: "", isError: false };

      this.diseaseId = this.initialId;
    } catch (error) {
      this.error = { message: error.message, isError: true };
    }
  }

  _validateParams(params) {
    for (const key in params) {
      if (key === "api-endpoint") {
        if (!params[key].includes("<>")) {
          throw new Error("Placeholder '<>' should be present in the API URL");
        }
      }
    }
  }

  _loadData() {
    this.API.get(this._getURL(this.diseaseId))
      .then(({ data }) => {
        this.data = {
          role: this.clickedRole,
          ...this._getDataObject(data),
        };

        this.activeNode = {
          id: this.data.details.id,
          label: this.data.details.label,
        };

        if (!this.historyClicked) {
          this.pathArray = [...this.pathArray, this.activeNode];
        }
      })
      .catch((e) => {
        console.error(e);
        this.error = { message: e.message, isError: true };
      })
      .finally(() => {
        this._loadingEnded();
      });
  }

  willUpdate(changed) {
    console.log("this.historyClicked", this.historyClicked);
    if (
      (changed.has("diseaseId") || changed.has("apiEndpoint")) &&
      this.diseaseId
    ) {
      this.error = { message: "", isError: false };
      this._loadData();
    }
    if (changed.has("pathArray")) {
      if (this.pathArray.length > 10) {
        this.pathArray = this.pathArray.slice(1);
      }
    }
  }

  firstUpdated() {
    this._loadingStarted();
    this.diseaseId = this.initialId;
  }
  _handleHistoryClick({ detail: { id } }) {
    this.historyClicked = true;
    this.diseaseId = id;
  }

  _getDataObject(incomingData) {
    //validate
    const nodeIdVal = getByPath(incomingData, this.nodeIdPath);
    if (!nodeIdVal) {
      throw new Error("Node id path is not valid");
    }
    const nodeLabelVal = getByPath(incomingData, this.nodeLabelPath);
    if (!nodeLabelVal) {
      throw new Error("Node label path is not valid");
    }
    const childrenArr = getByPath(incomingData, this.nodeRelationsChildrenPath);

    if (childrenArr instanceof Array) {
      if (childrenArr.length > 0) {
        if (!childrenArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!childrenArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node children is not valid ");
    }

    const parentsArr = getByPath(incomingData, this.nodeRelationsParentsPath);

    if (parentsArr instanceof Array) {
      if (parentsArr.length > 0) {
        if (!parentsArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!parentsArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node parents is not valid ");
    }

    return {
      details: {
        ...getByPath(incomingData, this.nodeDetailsPath),
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
        parents: parentsArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
      },
    };
  }

  _getURL(id) {
    return this.apiEndpoint.replace("<>", id);
  }

  _changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.historyClicked = false;
    this.diseaseId = e.detail.id;
    this.clickedRole = e.detail.role;
    this._loadingStarted();

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent("ontology-node-changed", {
          // here we can pass any data to the event through this.data
          detail: {
            id: e.detail.id,
            label: e.detail.label,
            ...this.data,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  _loadingStarted() {
    this._timer = setTimeout(() => {
      this.loading = true;
    }, 200);
  }

  _loadingEnded() {
    this.loading = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  render() {
    return y`
      <div class="container">
        ${this.showHistory
          ? y`<ontology-browser-path
              @history-clicked="${this._handleHistoryClick}"
              .path=${this.pathArray}
            >
            </ontology-browser-path>`
          : b}
        ${this.loading
          ? y`<div class="spinner">
              <img src="${spinner}"></img>
            </div>`
          : b}
        ${this.error.isError
          ? y`
              <ontology-error message="${this.error.message}"> </ontology-error>
            `
          : b}
        <ontology-browser-view
          .data=${this.data}
          @column-click="${this._changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }
}

customElements.define("ontology-browser", OntologyBrowser);

class Linechart extends Stanza {
  menu() {
    return [];
  }

  render() {
    appendCustomCss(this, this.params["custom_css_url"]);

    const root = this.root.querySelector("main");

    if (!this.ontologyViewer) {
      this.ontologyViewer = new OntologyBrowser(root);
    }

    this.ontologyViewer.updateParams(this.params);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "ontology-browser",
	"stanza:label": "Ontology browser",
	"stanza:definition": "Graphical ontology browser",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-09-06",
	"stanza:updated": "2022-09-06",
	"stanza:parameter": [
	{
		"stanza:key": "api_endpoint",
		type: "string",
		"stanza:example_old": "https://togovar.biosciencedbc.jp/api/inspect/disease?node=<>",
		"stanza:example": "https://hpo.jax.org/api/hpo/term/<>",
		"stanza:description": "Get node details and relations API endpoint",
		"stanza:required": true
	},
	{
		"stanza:key": "custom_css_url",
		type: "string",
		"stanza:example": "",
		"stanza:description": "URL of custom CSS",
		"stanza:required": false
	},
	{
		"stanza:key": "initial_id",
		type: "string",
		"stanza:example_old": "MONDO_0005709",
		"stanza:example": "HP:0001168",
		"stanza:description": "Node id to be shown at load time",
		"stanza:required": true
	},
	{
		"stanza:key": "node-id_path",
		type: "string",
		"stanza:example_old": "id",
		"stanza:example": "details.id",
		"stanza:description": "Key with unique node id",
		"stanza:required": true
	},
	{
		"stanza:key": "node-label_path",
		type: "string",
		"stanza:example_old": "label",
		"stanza:example": "details.name",
		"stanza:description": "JSON path to node label path, separated by dot '.' (e.g. 'details.label') ",
		"stanza:required": true
	},
	{
		"stanza:key": "node-details_path",
		"stanza:type": "string",
		"stanza:example_old": "",
		"stanza:example": "details",
		"stanza:description": "JSON path to node details data in API response, separated by dot '.' (e.g. 'data.details') ",
		"stanza:required": false
	},
	{
		"stanza:key": "node-details_show_keys",
		"stanza:type": "string",
		"stanza:example": "definition, synonyms, xrefs",
		"stanza:description": "Show keys list, comma separated",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-parents_path",
		"stanza:type": "string",
		"stanza:example_old": "parents",
		"stanza:example": "relations.parents",
		"stanza:description": "JSON path to node parents array, separated by dot '.' (e.g. 'data.relations.parents')",
		"stanza:required": true
	},
	{
		"stanza:key": "node-relations-children_path",
		"stanza:type": "string",
		"stanza:example_old": "children",
		"stanza:example": "relations.children",
		"stanza:description": "JSON path to node children array,  separated by dot '.' (e.g. 'data.relations.children')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-id_key",
		"stanza:type": "string",
		"stanza:example_old": "id",
		"stanza:example": "ontologyId",
		"stanza:description": "JSON path to id key of parent or child node,  separated by dot '.' (e.g. 'path.to.id')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-label_key",
		"stanza:type": "string",
		"stanza:example_old": "label",
		"stanza:example": "name",
		"stanza:description": "JSON path to label key of parent or child node,  separated by dot '.' (e.g. 'path.to.label')",
		"stanza:required": false
	},
	{
		"stanza:key": "show_history",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Whether to show history of navigation",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Card font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Card title font size"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "text",
		"stanza:default": "8px",
		"stanza:description": "Card contents font size"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "text",
		"stanza:default": "500px",
		"stanza:description": "Stanza height. Width is always 100%, a la div with `display: block`"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#9b9ca1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-color_selected",
		"stanza:type": "color",
		"stanza:default": "#1f9dad",
		"stanza:description": "Selected border color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Node background color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color_selected",
		"stanza:type": "color",
		"stanza:default": "#fff6e0",
		"stanza:description": "Selected node background color"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "ontology-node-changed",
		"stanza:description": "Being dispatched on change of the active node. `event.details` contains the info of that node."
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=ontology-browser.js.map
