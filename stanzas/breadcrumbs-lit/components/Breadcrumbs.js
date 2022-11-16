import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";
import { applyConstructor } from "@/lib/utils";

export class Breadcrumbs extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 0.2em;
        row-gap: 0.3em;
        align-items: start;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      currentId: { state: true },
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
  }

  updateParams(params, data) {
    this.data = structuredClone(data);

    applyConstructor.call(this, params);

    //check if nodes without parents are present

    if (this.data.some((d) => d[this.nodeKey])) {
      this.data.forEach((d) => {
        this.nodesMap.set("" + d[this.nodeKey], d);
      });

      this.currentId = this.nodeInitialId;
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
    } else if (idsWithoutParent.length === 1) {
      this.rootNodeId = idsWithoutParent[0];
    } else {
      throw new Error("Root node not found");
    }

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

    this.requestUpdate();
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
        traverse("" + currentNode.parent);
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

  render() {
    return html` <breadcrumbs-node
        .node="${{
          label: "",
          id: "copy",
        }}"
        .iconName=${"Copy"}
        .menuItems="${[]}"
        mode="copy"
        @click=${this._handleCopy}
      ></breadcrumbs-node>
      ${map(this.pathToShow, (node) => {
        return html`
          <breadcrumbs-node
            @click=${() => {
              this.currentId = "" + node[this.nodeKey];
            }}
            @node-hover=${this._handleNodeHover}
            @menu-item-clicked=${({ detail }) =>
              (this.currentId = "" + detail.id)}
            data-id="${node[this.nodeKey]}"
            .node="${{
              label: node[this.nodeLabelKey],
              id: node[this.nodeKey],
            }}"
            .menuItems=${this._getByParent(node.parent).filter(
              (d) => d[this.nodeKey] !== node[this.nodeKey]
            )}
            .showDropdown=${this.nodeShowDropdown}
            .iconName=${node[this.nodeKey] === this.rootNodeId
              ? this.rootNodeLabelIcon
              : null}
          />
        `;
      })}`;
  }
}

customElements.define("breadcrumbs-lit", Breadcrumbs);
