import Stanza from "togostanza/stanza";
import { select, scaleOrdinal, scaleSqrt, group, extent } from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend";
import { StanzaColorGenerator } from "../../lib/ColorGenerator";
import { v4 as uuidv4 } from "uuid";
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
    const sizeKey = this.params["node-size_key"];
    const colorKey = this.params["node-color_key"];
    const sizeMin = this.params["node-size_min"] || 1;
    const sizeMax = this.params["node-size_max"] || 10;

    //const groupingKey = this.params["grouping-key"];
    const width = parseInt(css("--togostanza-canvas-width"));
    const height = parseInt(css("--togostanza-canvas-height"));

    const colorSym = Symbol("color");
    const sizeSym = Symbol("size");
    const idSym = Symbol("id");
    const xSym = Symbol("x");
    const ySym = Symbol("y");

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

    const colorKeys = [...new Set(data.map((d) => d[colorKey]))];
    // color.domain(groupNames);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());

    const root = this.root;

    const main = root.querySelector("main");

    if (!main.querySelector("svg")) {
      main.append(svg);
    }

    if (!this.xAxis) {
      this.xAxis = new Axis(svg);
    }
    if (!this.yAxis) {
      this.yAxis = new Axis(svg);
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
      tickLabelsAngle: this.params["axis-x-ticks_label_angle"],
      ticksInterval: undefined,
    });

    this.yAxis.update({
      scale: this.params["axis-y-scale"],
      placement: "left",
      title: this.params["axis-y-title"],
      titlePadding: this.params["axis-y-title_padding"],
      drawArea,
      domain: yAxisDomain,
      margins: axisInnerMargins,
      ticksInterval: undefined,
      tickLabelsAngle: this.params["axis-y-ticks_label_angle"],
    });

    for (const datum of data) {
      datum[sizeSym] = sizeScale(parseFloat(datum[sizeKey]));
      datum[idSym] = uuidv4();
      datum[xSym] = this.xAxis.scale(parseFloat(datum[xKey]));
      datum[ySym] = this.yAxis.scale(parseFloat(datum[yKey]));
    }

    const chartContent = select(svg)
      .append("g")
      .attr(
        "transform",
        `translate(${this.xAxis.axisArea.x}, ${this.xAxis.axisArea.y})`
      )
      .classed("chart-content", true);

    const circlesUpdate = chartContent
      .selectAll("circle")
      .data(data, (d) => d[idSym]);

    const circlesEnter = circlesUpdate
      .enter()
      .append("circle")
      .attr("cx", (d) => d[xSym])
      .attr("cy", (d) => d[ySym])
      .attr("r", (d) => d[sizeSym])
      .attr("fill", (d) => d[colorSym]);
  }
}
