import Stanza from "togostanza/stanza";
import { select, scaleOrdinal, scaleSqrt, extent, format } from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend2";
import { StanzaColorGenerator } from "../../lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import { getMarginsFromCSSString } from "../../lib/utils";
import { Axis } from "../../lib/AxisMixin";

type MarginsT = {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
};

export default class ScatterPlot extends Stanza {
  _data: any[];
  xAxis: Axis;
  yAxis: Axis;
  legend: Legend;
  tooltips: ToolTip;

  menu() {
    return [
      downloadSvgMenuItem(this, this.metadata["@id"]),
      downloadPngMenuItem(this, this.metadata["@id"]),
      downloadJSONMenuItem(this, this.metadata["@id"], this._data),
      downloadCSVMenuItem(this, this.metadata["@id"], this._data),
      downloadTSVMenuItem(this, this.metadata["@id"], this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    const colorGenerator = new StanzaColorGenerator(this);
    const color = scaleOrdinal().range(colorGenerator.stanzaColor as string[]);

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const data = structuredClone(this._data);

    const MARGINS: MarginsT = getMarginsFromCSSString(
      css("--togostanza-canvas-padding")
    );

    const xKey = this.params["axis-x-key"];
    const yKey = this.params["axis-y-key"];
    const xScale = this.params["axis-x-scale"];
    const yScale = this.params["axis-y-scale"];
    const xTitle = this.params["axis-x-title"];
    const xTitlePadding = this.params["axis-x-title_padding"];
    const yTitle = this.params["axis-y-title"];
    const yTitlePadding = this.params["axis-y-title_padding"];
    const xTicksInterval = this.params["axis-x-ticks_interval"];
    const yTicksInterval = this.params["axis-y-ticks_interval"];
    const xTicksLabelsAngle = this.params["axis-x-ticks_label_angle"];
    const yTicksLabelsAngle = this.params["axis-y-ticks_label_angle"];
    const xTicksLabelsFormat = this.params["axis-x-ticks_labels_format"];
    const yTicksLabelsFormat = this.params["axis-y-ticks_labels_format"];
    const xGridInterval = this.params["axis-x-gridlines_interval"];
    const yGridInterval = this.params["axis-y-gridlines_interval"];
    const sizeKey = this.params["node-size_key"];
    const sizeMin = this.params["node-size_min"] || 3;
    const sizeMax = this.params["node-size_max"] || sizeMin;
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    const tooltipKey = this.params["tooltips-key"];

    const width = parseInt(css("--togostanza-canvas-width"));
    const height = parseInt(css("--togostanza-canvas-height"));

    const colorSym = Symbol("color");
    const sizeSym = Symbol("size");
    const idSym = Symbol("id");
    const xSym = Symbol("x");
    const ySym = Symbol("y");
    const tooltipSym = Symbol("tooltip");

    const nodeSizes = extent<number, number>(
      data,
      (d) => parseFloat(d[sizeKey]) || 0
    );

    const sizeScale = scaleSqrt().range([sizeMin, sizeMax]).domain(nodeSizes);

    const xAxisDomain = extent<number, number>(data, (d) =>
      parseFloat(d[xKey])
    );
    const yAxisDomain = extent<number, number>(data, (d) =>
      parseFloat(d[yKey])
    );

    const root = this.root;

    const main = root.querySelector("main");

    let svg = main.querySelector("svg");
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());
      main.append(svg);
    }

    if (!this.xAxis) {
      this.xAxis = new Axis(svg);
    }

    if (!this.yAxis) {
      this.yAxis = new Axis(svg);
    }

    const existingLegend = this.root.querySelector("togostanza--legend2");

    if (existingLegend) {
      existingLegend.remove();
    }

    function getNodeSizesForLegend(amount = 7) {
      const sizeMin = sizeScale(nodeSizes[0]);
      const sizeMax = sizeScale(nodeSizes[1]);

      const legendSize = [{ size: sizeMin, value: nodeSizes[0] }];

      const rInterval = sizeMax - sizeMin;
      const vInterval = nodeSizes[1] - nodeSizes[0];
      const rStep = rInterval / (amount - 1);
      const vStep = vInterval / (amount - 1);

      for (let i = 1; i < amount - 1; i++) {
        legendSize.push({
          size: sizeMin + i * rStep,
          value: nodeSizes[0] + i * vStep,
        });
      }

      legendSize.push({ size: sizeMax, value: nodeSizes[1] });

      return legendSize;
    }

    if (!this.tooltips) {
      this.tooltips = new ToolTip();
      main.append(this.tooltips);
    }

    const drawArea = {
      x: MARGINS.LEFT,
      y: MARGINS.TOP,
      width: width - MARGINS.LEFT - MARGINS.RIGHT,
      height: height - MARGINS.TOP - MARGINS.BOTTOM,
    };

    const axisInnerMargins = { TOP: 0, BOTTOM: 0, LEFT: 0, RIGHT: 0 };

    this.xAxis.update({
      scale: xScale,
      placement: "bottom",
      title: xTitle,
      titlePadding: xTitlePadding,
      drawArea,
      domain: xAxisDomain,
      margins: axisInnerMargins,
      ticksInterval: xTicksInterval,
      tickLabelsAngle: xTicksLabelsAngle,
      gridInterval: xGridInterval,
      ticksLabelsFormat: xTicksLabelsFormat,
    });

    this.yAxis.update({
      scale: yScale,
      placement: "left",
      title: yTitle,
      titlePadding: yTitlePadding,
      drawArea,
      domain: yAxisDomain,
      margins: axisInnerMargins,
      ticksInterval: yTicksInterval,
      tickLabelsAngle: yTicksLabelsAngle,
      gridInterval: yGridInterval,
      ticksLabelsFormat: yTicksLabelsFormat,
    });

    data.forEach((datum, i) => {
      const size = parseFloat(datum[sizeKey]);
      datum[sizeSym] = isNaN(size) ? sizeMin : sizeScale(size);
      datum[idSym] =
        "" + i + datum[xKey] + datum[yKey] + datum[sizeKey] + xScale + yScale;
      datum[xSym] = this.xAxis.scale(parseFloat(datum[xKey]));
      datum[ySym] = this.yAxis.scale(parseFloat(datum[yKey]));
      datum[colorSym] = colorGenerator.stanzaColor[0];
      datum[tooltipSym] = datum[tooltipKey];
    });

    if (showLegend) {
      this.legend = new Legend();
      root.append(this.legend);

      this.legend.items = getNodeSizesForLegend().map((item, i) => ({
        id: "" + i,
        value: format(".2s")(item.value),
        color: colorGenerator.stanzaColor[0],
        size: item.size * 2,
      }));

      this.legend.title = legendTitle;
    }

    const showTooltips = data.some((d) => d[tooltipSym]);

    let chartContent = select(svg).select(".chart-content");

    if (chartContent.empty()) {
      chartContent = select(svg).append("g").classed("chart-content", true);
    }

    const circlesUpdate = chartContent
      .attr(
        "transform",
        `translate(${this.xAxis.axisArea.x}, ${this.xAxis.axisArea.y})`
      )
      .selectAll("circle")
      .data(data, (d) => d[idSym]);

    const enteredCircles = circlesUpdate
      .enter()
      .append("circle")
      .attr("class", "chart-node")
      .attr("data-tooltip", (d) => d[tooltipSym])
      .attr("cx", (d) => d[xSym])
      .attr("cy", (d) => d[ySym])
      .attr("r", (d) => d[sizeSym])
      .attr("fill", (d) => d[colorSym]);

    if (showTooltips) {
      this.tooltips.setup(enteredCircles.nodes());
    }

    enteredCircles.on("mouseenter", function () {
      const node = select(this);
      enteredCircles.classed("-fadeout", true);
      node.classed("-fadeout", false);
    });
    enteredCircles.on("mouseleave", function () {
      enteredCircles.classed("-fadeout", false);
    });

    circlesUpdate.exit().remove();
  }
}
