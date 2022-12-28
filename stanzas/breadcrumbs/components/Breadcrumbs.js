import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { applyConstructor } from "@/lib/utils";
import { ref, createRef } from "lit/directives/ref.js";

export class Breadcrumbs extends LitElement {
  static get properties() {
    return {
      currentId: { type: String, reflect: true },
      data: { type: Array, state: true },
    };
  }
  constructor(element) {
    super();

    element.append(this);

    this.data = [];
    this.loading = false;
    this.pathToShow = [];
    this.nodesMap = new Map();
    this.currentMenuItems = [];
    this.hoverNodeId = "";

    this.rootNodeId = null;
    this.pathToCopy = "/";
    this.observedStyle = null;
    this.observer = null;

    this.invisibleNode = createRef();
  }

  updateParams(params, data) {
    // eslint-disable-next-line no-undef
    this.data = structuredClone(data);

    applyConstructor.call(this, params);

    //check if nodes without parents are present

    if (this.data.some((d) => d[this.nodeKey])) {
      this.data.forEach((d) => {
        this.nodesMap.set("" + d[this.nodeKey], d);
      });

      this.currentId = "" + this.nodeInitialId;
    } else {
      throw new Error("Key not found");
    }

    const idsWithoutParent = [];

    this.nodesMap.forEach((d) => {
      if (!d.parent) {
        idsWithoutParent.push("" + d[this.nodeKey]);
      }
    });

    if (idsWithoutParent.length > 1) {
      this.rootNodeId = "root";
      const rootNode = {
        [this.nodeKey]: this.rootNodeId,
        [this.nodeLabelKey]: this.rootNodeLabelText,
      };
      this.nodesMap.set(this.rootNodeId, rootNode);
      this.data.push(rootNode);
      idsWithoutParent.forEach((id) => {
        const itemWithoutParent = this.nodesMap.get("" + id);
        itemWithoutParent.parent = this.rootNodeId;
      });
    } else if (idsWithoutParent.length === 0) {
      throw new Error("Root node not found");
    }
  }

  firstUpdated() {
    // create invisible node to watch for style changes

    this.observedStyle = getComputedStyle(this.invisibleNode.value);

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (
            this.observedStyle["font-size"] &&
            !isNaN(parseFloat(this.observedStyle["font-size"]))
          ) {
            this.requestUpdate();
          }
        }
      });
    });

    this.observer.observe(this.parentElement, {
      attributes: true,
      subtree: false,
      childList: true,
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  willUpdate(changed) {
    if (changed.has("currentId")) {
      this.pathToShow = this._getPath(this.currentId);
      this.pathToCopy = this.pathToShow
        .map((p) => p[this.nodeLabelKey])
        .join("/");
    }
  }

  _getByParent(parentId) {
    return this.data.filter((d) => "" + d.parent === "" + parentId);
  }

  _getPath(currentId) {
    const pathToShow = [];
    const traverse = (id) => {
      const currentNode = this.nodesMap.get(id);
      if (currentNode) {
        pathToShow.push(currentNode);
        traverse("" + (currentNode.parent || -1));
      }
    };
    traverse(currentId);
    return pathToShow.reverse();
  }

  _handleNodeHover(e) {
    const { id } = e.detail;
    this.hoverNodeId = id;

    const node = this.nodesMap.get("" + id);
    const parentId = node.parent;
    const siblings = this._getByParent(parentId).filter(
      (d) => "" + d[this.nodeKey] !== "" + id
    );

    this.currentMenuItems = siblings.map((d) => ({
      label: d[this.nodeLabelKey],
      id: d[this.nodeKey],
    }));
  }

  _handleCopy() {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        if (this.pathToCopy) {
          navigator.clipboard.writeText(this.pathToCopy).then(() => {
            console.log("Copied");
          });
        }
      } else {
        console.error("Browser is not permitted to copy text to clipboard");
      }
    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html` ${this.showCopyButton &&
      html`<breadcrumbs-node
        .node="${{
          label: "",
          id: "copy",
        }}"
        .iconName=${"Copy"}
        .menuItems="${[]}"
        mode="copy"
        @click=${this._handleCopy}
      ></breadcrumbs-node>`}
      <breadcrumbs-node
        ${ref(this.invisibleNode)}
        mode="invisible"
        .node="${{
          label: "a",
          id: 1,
        }}"
      ></breadcrumbs-node>
      ${map(this.pathToShow, (node) => {
        return html`
          <breadcrumbs-node
            @click=${() => {
              this.currentId = "" + node[this.nodeKey];
              this.dispatchEvent(
                new CustomEvent("selectedDatumChanged", {
                  detail: { id: "" + node[this.nodeKey] },
                  bubbles: true,
                  composed: true,
                })
              );
            }}
            @node-hover=${this._handleNodeHover}
            @menu-item-clicked=${({ detail }) =>
              (this.currentId = "" + detail.id)}
            data-id="${node[this.nodeKey]}"
            .node="${{
              label: node[this.nodeLabelKey],
              id: node[this.nodeKey],
            }}"
            .menuItems=${this._getByParent(node.parent)
              .filter((d) => d[this.nodeKey] !== node[this.nodeKey])
              .map((node) => {
                return {
                  label: node[this.nodeLabelKey],
                  id: node[this.nodeKey],
                };
              })}
            .showDropdown=${this.nodeShowDropdown}
            .iconName=${node[this.nodeKey] === this.rootNodeId
              ? this.rootNodeLabelIcon
              : null}
          />
        `;
      })}`;
  }
}

customElements.define("breadcrumbs-el", Breadcrumbs);
