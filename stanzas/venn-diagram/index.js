import Legend from "@/lib/Legend2";
import ToolTip from "@/lib/ToolTip";
import Color from "color";
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

  async renderNext() {
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
      this.root.append(this.legend);
    }

    // get data
    this.data = transform(this._data);

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
    // const tooltipsTemplate = Handlebars.compile(this.params["tooltips-html"]);
    // const tooltipsVariables = getTemplateVariables(this.params["tooltips-html"]);
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
    this.tooltip.setTemplate(this.params["tooltips-html"]);
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
          "nodes",
          [selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`)],
        ],
      ]);
    });
    this.legend.setup({
      title: this.params["legend-title"],
      items
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

/*
  * Venn 図のデータを変換する関数
  * @param {Object} data - データオブジェクト
  * @returns {Array} - 変換されたデータの配列
  *   各要素は { sets: [集合名], count: 要素数, elements: [要素] } の形式
  *  例: { A: [1, 2], B: [2, 3] } => [ { sets: ['A'], count: 1, elements: [1] }, ... ]
  *   @description
  *   1. data オブジェクトのキーを取得
  *   2. 各キーに対して、非空の部分集合を列挙
  *   3. 各部分集合に対して、要素の交差を計算
  *   4. 結果を配列に格納
  *   5. 最終的に、各部分集合の要素数と要素を持つオブジェクトの配列を返す
  *   @example
  *   const data = { A: [1, 2], B: [2, 3] };
  *   const result = transform(data);
  *   console.log(result);
  *   // => [
  *   //      { sets: ['A'], count: 1, elements: [1] },
  *   //      { sets: ['B'], count: 1, elements: [3] },
  *   //      { sets: ['A', 'B'], count: 1, elements: [2] }
  *   //    ]
  */
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




