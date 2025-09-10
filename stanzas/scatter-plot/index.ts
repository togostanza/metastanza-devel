import { Axis } from "@/lib/AxisMixin";
import getStanzaColors from "@/lib/ColorGenerator";
import Legend from "@/lib/Legend2";
import MetaStanza, {
  METASTANZA_DATA_ATTR,
  METASTANZA_NODE_ID_KEY,
} from "@/lib/MetaStanza";
import ToolTip from "@/lib/ToolTip";
import { NodeSelectionPlugin } from "@/lib/plugins/NodeSelectionPlugin";
import { getMarginsFromCSSString } from "@/lib/utils";
import { extent, format, scaleOrdinal, scaleSqrt, select } from "d3";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

type MarginsT = {
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
};

const colorSym = Symbol("color");
const sizeSym = Symbol("size");
const idSym = Symbol("id");
const xSym = Symbol("x");
const ySym = Symbol("y");

export default class ScatterPlot extends MetaStanza {
  xAxis: Axis;
  yAxis: Axis;
  legend: Legend;
  tooltips: ToolTip;
  _graphArea: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  _selectionPlugin = new NodeSelectionPlugin();

  menu() {
    return [
      downloadSvgMenuItem(this, this.metadata["@id"]),
      downloadPngMenuItem(this, this.metadata["@id"]),
      downloadJSONMenuItem(this, this.metadata["@id"], this._data),
      downloadCSVMenuItem(this, this.metadata["@id"], this._data),
      downloadTSVMenuItem(this, this.metadata["@id"], this._data),
    ];
  }

  async renderNext() {
    if (this._error) {
      return null;
    }

    this.use(this._selectionPlugin);
    let svg = select(this._main.querySelector("svg"));

    const existingLegend = this.root.querySelector("togostanza--legend2");

    if (existingLegend) {
      existingLegend.remove();
    }

    if (
      !this._error &&
      this._main.querySelector(".metastanza-error-message-div")
    ) {
      this._main.querySelector(".metastanza-error-message-div").remove();
    }

    if (!svg.empty()) {
      svg.remove();
      this.xAxis = null;
      this.yAxis = null;
    }

    if (this._error) {
      return null;
    }

    svg = select(this._main).append("svg");

    svg
      .attr("width", +this.css("--togostanza-canvas-width"))
      .attr("height", +this.css("--togostanza-canvas-height"));

    const data = structuredClone(this._data);

    const groupKey = this.params["group-key"];
    const nodeColorKey = this.params["node-color_key"];

    const stanzaColors = getStanzaColors(this);
    const color = scaleOrdinal<string, string>()
      .range(stanzaColors.slice(1))
      .unknown(stanzaColors[0]);

    let groupNames: string[] = [];
    let isThereUndefinedGroup = false;
    if (groupKey) {
      const rawGroupValues = Array.from(
        new Set(data.map((d) => d[groupKey] ?? ""))
      );
      groupNames = rawGroupValues.filter(Boolean) as string[];

      // if all groups are defined, don't use the color for undefined value
      if (rawGroupValues.length === groupNames.length) {
        color.range(stanzaColors);
      } else {
        isThereUndefinedGroup = true;
      }

      color.domain(groupNames);
    }

    const MARGINS: MarginsT = getMarginsFromCSSString(
      this.css("--togostanza-canvas-padding")
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
    const nodeColorBlendMode = this.params["node-color_blend"] || "normal";
    // const tooltipKey = this.params["tooltips-key"];
    const showTooltips = !!this.params["tooltip"];

    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));

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

    const main = this._main;

    if (!this.xAxis) {
      this.xAxis = new Axis(svg.node());
    }

    if (!this.yAxis) {
      this.yAxis = new Axis(svg.node());
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

    if (showTooltips) {
      if (!this.tooltips) {
        this.tooltips = new ToolTip();
        main.append(this.tooltips);
      }
      this.tooltips.setTemplate(this.params["tooltip"]);
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
      datum[colorSym] = datum[nodeColorKey] ?? color(datum[groupKey]);
    });

    if (showLegend && !this._error) {
      this.legend = new Legend();
      root.append(this.legend);

      const legendItems = [];

      // Add color legend if groupKey is set
      if (groupKey) {
        const colorLegendItems = groupNames.map((groupName) => ({
          id: `color-${groupName}`,
          value: groupName,
          color: color(groupName),
        }));

        if (isThereUndefinedGroup) {
          // add color item for undefined group
          colorLegendItems.push({
            id: `color-others`,
            value: "",
            color: color(""),
          });
        }
        legendItems.push(...colorLegendItems);
      }

      // Add size legend (always)
      const sizeLegendItems = getNodeSizesForLegend().map((item, i) => ({
        id: `size-${i}`,
        value: format(".2s")(item.value),
        color: groupKey ? "transparent" : stanzaColors[0], // For border-only circles
        size: item.size * 2,
      }));
      legendItems.push(...sizeLegendItems);

      this.legend.items = legendItems;
      this.legend.title = legendTitle;
    }

    this._graphArea = select<SVGGElement, object>(svg.node()).select(
      ".chart-content"
    );

    if (this._graphArea.empty()) {
      this._graphArea = select(svg.node())
        .append("g")
        .classed("chart-content", true)
        .classed("-nodes-blend-multiply", nodeColorBlendMode === "multiply")
        .classed("-nodes-blend-screen", nodeColorBlendMode === "screen");
    }

    const circlesUpdate = this._graphArea
      .attr(
        "transform",
        `translate(${this.xAxis.axisArea.x}, ${this.xAxis.axisArea.y})`
      )
      .selectAll("circle.chart-node")
      .data(data, (d) => d[idSym]);

    const enteredCircles = circlesUpdate
      .enter()
      .append("circle")
      .attr("class", "chart-node")
      .attr("data-tooltip", (d) => this.tooltips?.compile(d) ?? "")
      .attr("cx", (d) => d[xSym])
      .attr("cy", (d) => d[ySym])
      .attr("r", (d) => d[sizeSym])
      .attr("fill", (d) => d[colorSym]);

    if (showTooltips) {
      const nodesWithTooltips = this._main.querySelectorAll("[data-tooltip]");
      this.tooltips.setup(nodesWithTooltips);
    }

    this._graphArea
      .selectAll(".chart-node")
      .attr(METASTANZA_DATA_ATTR, (d) => d[METASTANZA_NODE_ID_KEY]);

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

  handleEvent(event) {
    // Selection events are now handled by the NodeSelectionPlugin
  }
}
