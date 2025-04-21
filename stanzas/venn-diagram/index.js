import Legend from "@/lib/Legend";
import ToolTip from "@/lib/ToolTip";
import Color from "color";
import Handlebars from "handlebars/dist/handlebars.js";
import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import loadData from "togostanza-utils/load-data";
import MetaStanza from "@/lib/MetaStanza";

const LINE_HEIGHT = 1;

export default class VennStanza extends MetaStanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
      downloadJSONMenuItem(this, "vennstanza", this.data),
      downloadCSVMenuItem(this, "vennstanza", this.data),
      downloadTSVMenuItem(this, "vennstanza", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: "stanza.html.hbs" });

    // append tooltip, legend
    const root = this.root.querySelector("main");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }
    if (this.params["legend-visible"]) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    const data = await this.getData();
    this.data = transform(data);

    this.totals = this.data.map((datum) => {
      const total = {
        set: datum.sets,
        count: 0,
      };
      const matchedData = this.data.filter((datum2) =>
        datum.sets.every((item) => datum2.sets.indexOf(item) !== -1)
      );
      total.count = matchedData.reduce((acc, datum) => acc + datum.count, 0);
      return total;
    });
    this.dataLabels = Array.from(
      new Set(this.data.map((datum) => datum.sets).flat())
    );
    this.numberOfData = this.dataLabels.length;
    this.venn = new Map();

    // draw
    this.drawVennDiagram();
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector("#venn-diagrams");

    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const svgWidth = getPropertyValue(`--togostanza-canvas-width`);
    const svgHeight = getPropertyValue(`--togostanza-canvas-height`);
    container.style.width = svgWidth + "px";
    container.style.height = svgHeight + "px";

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(
      `.venn-diagram[data-number-of-data="${this.numberOfData}"]`
    );
    const padding = +getPropertyValue(`--togostanza-canvas-padding`);
    if (!selectedDiagram) {
      console.error(
        "Venn diagrams with more than six elements are not supported. Please try using Euler diagrams."
      );
      return;
    }
    selectedDiagram.classList.add("-current");
    this.venn.set("node", selectedDiagram);

    // set scale
    const containerRect = this.root
      .querySelector("main")
      .getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin =
      Math.max(rect.x - containerRect.x, rect.y - containerRect.y) + padding;
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.style.transform = `translate(${padding}px, ${padding}px) scale(${scale})`;

    // typography
    const fontStyles = [
      {
        className: "label",
        varSuffix: "primary",
      },
      {
        className: "value",
        varSuffix: "secondary",
      },
    ].map(({ className, varSuffix }) => {
      const fontSize = +window
        .getComputedStyle(this.element)
        .getPropertyValue(`--togostanza-fonts-font_size_${varSuffix}`);
      const actualFontSize = fontSize / scale;
      selectedDiagram.querySelectorAll(`text.${className}`).forEach((text) => {
        text.style.fontSize = actualFontSize + "px";
      });
      return { className, varSuffix, fontSize, actualFontSize };
    });
    let textShiftY =
      fontStyles.reduce((acc, style) => acc + style.fontSize, 0) *
      LINE_HEIGHT *
      -0.5;
    selectedDiagram
      .querySelectorAll("text.label")
      .forEach((text) => text.setAttribute("dy", textShiftY));
    textShiftY += fontStyles[1].actualFontSize * LINE_HEIGHT;
    selectedDiagram
      .querySelectorAll("text.value")
      .forEach((text) => text.setAttribute("dy", textShiftY));

    // shapes
    const tooltipsTemplate = Handlebars.compile(this.params["tooltips-html"]);
    console.log(tooltipsTemplate);
    console.log(getTemplateVariables(this.params["tooltips-html"]));
    selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
      const targets = group.dataset.targets.split(",").map((target) => +target);
      const labels = targets.map((target) => this.dataLabels[target]);
      const count =
        this.data.find((datum) => {
          return (
            datum.sets.length === labels.length &&
            labels.every((label) =>
              datum.sets.find((label2) => label === label2)
            )
          );
        })?.count ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      const part = group.querySelector(":scope > .part");
      part.setAttribute("fill", color.toString());
      // set label
      group.querySelector(":scope .text > text.label").textContent =
        labels.join(",");
      group.querySelector(":scope .text > text.value").textContent = count;
      // interaction
      group.addEventListener("mouseenter", () =>
        selectedDiagram.classList.add("-hovering")
      );
      group.addEventListener("mouseleave", () =>
        selectedDiagram.classList.remove("-hovering")
      );
      // tooltip
      part.dataset.tooltip = `${labels.join("∩")}: ${count}`;
      //part.dataset.tooltipHtml = true;
    });
    console.log(this.data)
    console.log(this.params["tooltips-html"]);
    console.log(Handlebars)
    this.tooltip.setup(selectedDiagram.querySelectorAll("[data-tooltip]"));

    // legend
    const items = this.data.map((datum) => {
      const id = datum.sets
        .map((item) => this.dataLabels.indexOf(item))
        .sort()
        .join(",");
      const color = this.getBlendedColor(
        datum.sets.map((item) => this.dataLabels.indexOf(item))
      );
      return Object.fromEntries([
        ["id", id],
        ["label", datum.sets.map((item) => item).join("∩")],
        ["color", color.toString()],
        ["value", datum.count],
        [
          "node",
          selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`),
        ],
      ]);
    });
    this.legend.setup(items, this.root.querySelector("main"), {
      fadeoutNodes: selectedDiagram.querySelectorAll(":scope > g"),
      showLeaders: true,
    });
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-theme-series_${i}_color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = Color(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(
          Color(this.colorSeries[target]),
          1 / (index + 1)
        );
      }
    });
    if (targets.length > 1) {
      const ratio = (targets.length - 1) / (this.numberOfData - 1);
      switch (this.params["color-blend"]) {
        case "multiply":
          blendedColor = blendedColor.saturate(ratio);
          blendedColor = blendedColor.darken(ratio * 0.5);
          break;
        case "screen":
          blendedColor = blendedColor.saturate(ratio);
          blendedColor = blendedColor.lighten(ratio * 0.5);
          break;
      }
    }
    return blendedColor;
  }

  async getData() {
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    return data;
  }
}


function transform(data) {
  const keys = Object.keys(data);
  const n = keys.length;
  const result = [];

  // 非空の部分集合をすべて列挙
  for (let mask = 1; mask < (1 << n); mask++) {
    // mask が示す集合名の組み合わせ
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { subset.push(keys[i]); }
    }

    // 最初の集合で初期化し、以降の集合と交差を取る
    let elements = data[subset[0]].slice();
    for (let i = 1; i < subset.length; i++) {
      const k = subset[i];
      elements = elements.filter(x => data[k].includes(x));
      if (elements.length === 0) { break; }
    }

    if (elements.length > 0) {
      result.push({
        sets: subset,
        count: elements.length,
        elements
      });
    }
  }

  return result;
}

/**
 * Handlebars テンプレート文字列から、使われているトップレベルの変数名を抽出する関数
 * @param {string} templateStr — Handlebars テンプレート文字列
 * @returns {string[]} — 使われている変数名のユニークな配列
 */
function getTemplateVariables(templateStr) {
  // 1. テンプレート文字列を AST にパース
  const ast = Handlebars.parse(templateStr);

  // 2. 変数名を格納する Set
  const vars = new Set();

  // 3. 再帰的に AST をトラバースする関数
  function walk(node) {
    if (!node || typeof node !== 'object') return;

    // MustacheStatement（{{foo}}）や BlockStatement（{{#if foo}}...{{/if}}）などをチェック
    if (
      (node.type === 'MustacheStatement'     ) ||
      (node.type === 'BlockStatement'        ) ||
      (node.type === 'PartialStatement'      ) ||
      (node.type === 'SubExpression'         )
    ) {
      // node.path.parts = ['foo', 'bar', ...] の形式で分割された名前空間
      if (node.path && Array.isArray(node.path.parts)) {
        // トップレベルのキー部分だけ取りたいなら parts[0] を使う
        vars.add(node.path.parts[0]);
      }
    }

    // 4. 子ノードにも再帰的に.walk
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach(walk);
      } else {
        walk(child);
      }
    }
  }

  walk(ast);
  return Array.from(vars);
}


