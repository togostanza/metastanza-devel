import { h as s, y, r as b, w, S as Stanza, f as appendCustomCss, g as defineStanzaElement } from './index-ec45d824.js';
import { o } from './map-c0e24c36.js';
import { a as applyConstructor } from './utils-95f80352.js';
import { e, n } from './ref-3bab6ed0.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { F as FAIcons } from './index-461cb806.js';

class Breadcrumbs extends s {
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

    this.invisibleNode = e();
  }

  updateParams(params, data) {
    // eslint-disable-next-line no-undef
    this.data = structuredClone(data);

    applyConstructor.call(this, params);

    //check if nodes without parents are present
    if (this.data.some((d) => d[this.nodeKey])) {
      this.data.forEach((d) => {
        d.parent =
          typeof d.parent === "undefined" ? undefined : d.parent.toString();
        d[this.nodeKey] = d[this.nodeKey].toString();
        this.nodesMap.set(d[this.nodeKey], d);
      });

      this.currentId = this.nodeInitialId.toString();
    } else {
      throw new Error("Key not found");
    }

    const idsWithoutParent = [];

    this.nodesMap.forEach((d) => {
      if (typeof d.parent === "undefined") {
        idsWithoutParent.push(d[this.nodeKey]);
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
        const itemWithoutParent = this.nodesMap.get(id);
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
    return y` ${this.showCopyButton &&
      y`<breadcrumbs-node
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
        ${n(this.invisibleNode)}
        mode="invisible"
        .node="${{
          label: "a",
          id: 1,
        }}"
      ></breadcrumbs-node>
      ${o(this.pathToShow, (node) => {
        return y`
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

class Menu extends s {
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
    return y`
      <div
        data-id="breadcrumbs-node-menu"
        class="menu-wrapper"
        @mouseleave=${this._handleMouseLeave}
      >
        <div class="menu-triangle"></div>
        <div class="menu-triangle-overlay"></div>
        <div class="menu-container">
          <ul class="menu-items">
            ${o(
              this.menuItems,

              (d) =>
                y`
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

/* eslint-disable */
/*****************************************************************************
 *                                                                            *
 *  SVG Path Rounding Function                                                *
 *  Copyright (C) 2014 Yona Appletree                                         *
 *                                                                            *
 *  Licensed under the Apache License, Version 2.0 (the "License");           *
 *  you may not use this file except in compliance with the License.          *
 *  You may obtain a copy of the License at                                   *
 *                                                                            *
 *      http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                            *
 *  Unless required by applicable law or agreed to in writing, software       *
 *  distributed under the License is distributed on an "AS IS" BASIS,         *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 *  See the License for the specific language governing permissions and       *
 *  limitations under the License.                                            *
 *                                                                            *
 *****************************************************************************/

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 *
 * @param pathString The SVG input path
 * @param radius The amount to round the corners, either a value in the SVG
 *               coordinate space, or, if useFractionalRadius is true, a value
 *               from 0 to 1.
 * @param useFractionalRadius If true, the curve radius is expressed as a
 *               fraction of the distance between the point being curved and
 *               the previous and next points.
 * @returns A new SVG path string with the rounding
 */
function roundPathCorners(
  pathString,
  radius,
  useFractionalRadius
) {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    var width = targetPoint.x - movingPoint.x;
    var height = targetPoint.y - movingPoint.y;

    var distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance)
    );
  }
  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    };
  }

  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  // Split apart the path, handing concatonated letters and numbers
  var pathParts = pathString.split(/[,\s]/).reduce(function (parts, part) {
    var match = part.match("([a-zA-Z])(.+)");
    if (match) {
      parts.push(match[1]);
      parts.push(match[2]);
    } else {
      parts.push(part);
    }

    return parts;
  }, []);

  // Group the commands with their arguments for easier handling
  var commands = pathParts.reduce(function (commands, part) {
    if (parseFloat(part) == part && commands.length) {
      commands[commands.length - 1].push(part);
    } else {
      commands.push([part]);
    }

    return commands;
  }, []);

  // The resulting commands, also grouped
  var resultCommands = [];

  if (commands.length > 1) {
    var startPoint = pointForCommand(commands[0]);

    // Handle the close path case with a "virtual" closing line
    var virtualCloseLine = null;
    if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
      virtualCloseLine = ["L", startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(commands[0]);

    for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
      var prevCmd = resultCommands[resultCommands.length - 1];

      var curCmd = commands[cmdIndex];

      // Handle closing case
      var nextCmd =
        curCmd == virtualCloseLine ? commands[1] : commands[cmdIndex + 1];

      // Nasty logic to decide if this path is a candidite.
      if (
        nextCmd &&
        prevCmd &&
        prevCmd.length > 2 &&
        curCmd[0] == "L" &&
        nextCmd.length > 2 &&
        nextCmd[0] == "L"
      ) {
        // Calc the points we're dealing with
        var prevPoint = pointForCommand(prevCmd);
        var curPoint = pointForCommand(curCmd);
        var nextPoint = pointForCommand(nextCmd);

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        var curveStart, curveEnd;

        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(
            curPoint,
            prevCmd.origPoint || prevPoint,
            radius
          );
          curveEnd = moveTowardsFractional(
            curPoint,
            nextCmd.origPoint || nextPoint,
            radius
          );
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius);
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
        }

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
        var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);

        // Create the curve
        var curveCmd = [
          "C",
          startControl.x,
          startControl.y,
          endControl.x,
          endControl.y,
          curveEnd.x,
          curveEnd.y,
        ];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Pass through commands that don't qualify
        resultCommands.push(curCmd);
      }
    }

    // Fix up the starting point and restore the close path if the path was orignally closed
    if (virtualCloseLine) {
      var newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1]
      );
      resultCommands.push(["Z"]);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }

  return resultCommands.reduce(function (str, c) {
    return str + c.join(" ") + " ";
  }, "");
}

class Node extends s {
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

    this.svg = e();

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
      return b;
    } else {
      return y`
        <svg viewBox="0 0 ${this.icon[0]} ${this.icon[1]}" height="${this.emH}">
          ${w`<path d="${this.icon[4]}"></path>`}
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
    const nodeG = w`<g transform="translate(1,1)">
    <path class="node-outline" d="${this.pathD}"></path>
    ${
      this.icon
        ? w`<g class="home-icon" transform="translate(${
            -this.width / 2 + this.iconWidth / 2 + this.iconMarginLeft
          },${this.height / 2 - 0.7 * this.emH})">
    ${this._getIcon()}
    </g>`
        : b
    }
    <text class="node-label" transform="translate(${this.textMargin.left},${
      this.height / 2
    })">${this.node.label}</text>
  </g>`;

    return y`
      <svg
        @mouseover=${this._handleMouseOver}
        @mouseout=${this._handleMouseOut}
        xmlns="http://www.w3.org/2000/svg"
        width="${this.width}"
        height="${this.height}"
        ${n(this.svg)}
      >
        ${nodeG}
      </svg>

      ${this.showMenu && this.showDropdown && this.menuItems.length > 0
        ? y`<breadcrumbs-node-menu
            @menu-leave=${this._handleMenuLeave}
            style="top: ${this.height}px;"
            .menuItems=${this.menuItems}
          ></breadcrumbs-node-menu>`
        : b}
    `;
  }
}

customElements.define("breadcrumbs-node", Node);

class BreadcrumbsLit extends Stanza {
  menu() {
    return [];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const root = this.root.querySelector("main");

    if (isExamplePage.apply(this)) {
      root.style = null;
      const overflowEl = this.element.parentElement.parentElement;
      overflowEl.classList.remove("overflow-auto");
    }

    if (this.breadcrumbs) {
      this.breadcrumbs.remove();
    }

    this.breadcrumbs = new Breadcrumbs(root);

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root,
      5000
    );

    this.breadcrumbs.updateParams(this.params, data);
  }

  handleEvent(e) {
    if (e.details?.id) {
      this.breadcrumbs.setAttribute("currendId", "" + e.details.id);
    }
  }
}

/**
 *
 * @returns true if the page is example page, false otherwise
 */

function isExamplePage() {
  const hostname = window.location.hostname;
  const pageName = window.location.pathname.match(/([^/]+)(?=\.\w+$)/gi);
  const stanzaId = this.metadata["@id"];

  if (
    pageName &&
    pageName[0] === stanzaId &&
    (hostname.includes("metastanza") ||
      hostname.includes("localhost") ||
      hostname.includes("togostanza"))
  ) {
    return true;
  }

  return false;
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': BreadcrumbsLit
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "breadcrumbs",
	"stanza:label": "Breadcrumbs",
	"stanza:definition": "Breadcrumbs MetaStanza ",
	"stanza:type": "Stanza",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2022-04-07",
	"stanza:updated": "2022-04-07",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "node-key",
		"stanza:type": "string",
		"stanza:description": "Key of node unique id",
		"stanza:example": "id",
		"stanza:required": false
	},
	{
		"stanza:key": "node-initial_id",
		"stanza:type": "string",
		"stanza:description": "Initial node id",
		"stanza:example": "6",
		"stanza:required": false
	},
	{
		"stanza:key": "node-label_key",
		"stanza:type": "string",
		"stanza:description": "Initial node id",
		"stanza:example": "label",
		"stanza:required": false
	},
	{
		"stanza:key": "root_node-label_text",
		"stanza:type": "string",
		"stanza:description": "Text to show on root node",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "root_node-label_icon",
		"stanza:type": "string",
		"stanza:description": "Icon to use on root node (Font-awesome icon names)",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
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
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color_hover",
		"stanza:type": "color",
		"stanza:default": "#f9f9fa",
		"stanza:description": "Label font color on hover"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#DDDCDA",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-node-background_color_hover",
		"stanza:type": "color",
		"stanza:default": "#16ADE3",
		"stanza:description": "Background color of the nodes on mouseover"
	},
	{
		"stanza:key": "--togostanza-node-background_color",
		"stanza:type": "color",
		"stanza:default": "#F0F0EF",
		"stanza:description": "Background color of the nodes"
	},
	{
		"stanza:key": "--togostanza-theme-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:incomingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in other stanza"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in this stanza"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"breadcrumbs\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=breadcrumbs.js.map
