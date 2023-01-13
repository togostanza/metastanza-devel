import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import Color from "color";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

const LINE_HEIGHT = 1;

export default class VennStanza extends Stanza {
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
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    this.data = await this.getData();
    this.totals = this.data.map((datum) => {
      const total = {
        set: datum.set,
        size: 0,
      };
      const matchedData = this.data.filter((datum2) =>
        datum.set.every((item) => datum2.set.indexOf(item) !== -1)
      );
      total.size = matchedData.reduce((acc, datum) => acc + datum.size, 0);
      return total;
    });
    this.dataLabels = Array.from(
      new Set(this.data.map((datum) => datum.set).flat())
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
    selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
      const targets = group.dataset.targets.split(",").map((target) => +target);
      const labels = targets.map((target) => this.dataLabels[target]);
      const count =
        this.data.find((datum) => {
          return (
            datum.set.length === labels.length &&
            labels.every((label) =>
              datum.set.find((label2) => label === label2)
            )
          );
        })?.size ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      group
        .querySelector(":scope > .part")
        .setAttribute("fill", color.toString());
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
      group.dataset.tooltip = `<strong>${labels.join("∩")}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
    });
    this.tooltip.setup(selectedDiagram.querySelectorAll("[data-tooltip]"));

    // legend
    const items = this.data.map((datum) => {
      const id = datum.set
        .map((item) => this.dataLabels.indexOf(item))
        .sort()
        .join(",");
      const color = this.getBlendedColor(
        datum.set.map((item) => this.dataLabels.indexOf(item))
      );
      return Object.fromEntries([
        ["id", id],
        ["label", datum.set.map((item) => item).join("∩")],
        ["color", color.toString()],
        ["value", datum.size],
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
