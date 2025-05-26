import { extent, format, scaleOrdinal, scaleSqrt, select } from "d3";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { Axis } from "@/lib/AxisMixin";
import getStanzaColors from "@/lib/ColorGenerator";
import Legend from "@/lib/Legend2";
import MetaStanza from "@/lib/MetaStanza";
import {
  emitSelectedEvent,
  getMarginsFromCSSString,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "@/lib/utils";
import ToolTip from "@/lib/ToolTip";

const POINT_ID_KEY = "__togostanza_id__";

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
const tooltipSym = Symbol("tooltip");
const nodeUrlSym = Symbol("nodeUrl");

export default class ScatterPlot extends MetaStanza {
  xAxis: Axis;
  yAxis: Axis;
  legend: Legend;
  tooltips: ToolTip;
  selectedIds: Array<string | number> = [];
  _graphArea: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  selectedEventParams = {
    targetElementSelector: ".chart-node",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: POINT_ID_KEY,
  };

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

    const stanzaColors = getStanzaColors(this);
    const color = scaleOrdinal().range(stanzaColors as string[]);

    const data = structuredClone(this._data);

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
    const tooltipKey = this.params["tooltips-key"];
    const nodeUrlKey = this.params["node-url_key"];

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

    if (!this.tooltips) {
      this.tooltips = new ToolTip();
      this.tooltips.setTemplate(this.params["tooltip"]);
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
      datum[colorSym] = stanzaColors[0];
      datum[tooltipSym] = datum[tooltipKey];
      datum[nodeUrlSym] = datum[nodeUrlKey];
    });

    if (showLegend && !this._error) {
      this.legend = new Legend();
      root.append(this.legend);

      this.legend.items = getNodeSizesForLegend().map((item, i) => ({
        id: "" + i,
        value: format(".2s")(item.value),
        color: stanzaColors[0],
        size: item.size * 2,
      }));

      this.legend.title = legendTitle;
    }

    const showTooltips = !!this.params["tooltip"];

    this._graphArea = select<SVGGElement, object>(svg.node()).select(
      ".chart-content"
    );

    if (this._graphArea.empty()) {
      this._graphArea = select(svg.node())
        .append("g")
        .classed("chart-content", true);
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
      .attr("data-tooltip", (d) => this.tooltips.compile(d))
      .attr("cx", (d) => d[xSym])
      .attr("cy", (d) => d[ySym])
      .attr("r", (d) => d[sizeSym])
      .attr("fill", (d) => d[colorSym]);

    if (showTooltips) {
      const nodesWithTooltips = this._main.querySelectorAll("[data-tooltip");
      this.tooltips.setup(nodesWithTooltips);
    }

    if (this.params["event-outgoing_change_selected_nodes"]) {
      this._graphArea
        .selectAll(this.selectedEventParams.targetElementSelector)
        .on("click", (_, d) => {
          toggleSelectIds({
            selectedIds: this.selectedIds,
            targetId: d[POINT_ID_KEY],
          });

          updateSelectedElementClassNameForD3({
            drawing: this._graphArea,
            selectedIds: this.selectedIds,
            ...this.selectedEventParams,
          });

          emitSelectedEvent({
            rootElement: this.element,
            targetId: d[POINT_ID_KEY],
            selectedIds: this.selectedIds,
            dataUrl: this.params["data-url"],
          });
        });
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

  handleEvent(event) {
    const { selectedIds, dataUrl } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      updateSelectedElementClassNameForD3({
        drawing: this._graphArea,
        selectedIds,
        ...this.selectedEventParams,
      });
    }
  }
}
