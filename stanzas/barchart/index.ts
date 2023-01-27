import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend";
import { Axis, AxisParamsI, paramsModel } from "../../lib/AxisMixin";

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
import { string } from "zod";
import { select } from "d3";

export default class Barchart extends Stanza {
  _data: any[];
  xAxisGen: Axis;
  yAxisGen: Axis;
  _graphArea: d3.Selection<SVGGElement, {}, SVGElement, any>;
  _groupedData: Map<string | number, {}[]>;
  _dataByX: Map<string | number, {}[]>;

  menu() {
    return [
      downloadSvgMenuItem(this, "barchart"),
      downloadPngMenuItem(this, "barchart"),
      downloadJSONMenuItem(this, "barchart", this._data),
      downloadCSVMenuItem(this, "barchart", this._data),
      downloadTSVMenuItem(this, "barchart", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key: string) =>
      getComputedStyle(this.element).getPropertyValue(key);

    const colorGenerator = new StanzaColorGenerator(this);
    const togostanzaColors = colorGenerator.stanzaColor;

    const color = d3.scaleOrdinal().range(togostanzaColors);

    const MARGIN = getMarginsFromCSSString(css("--togostanza-canvas-padding"));

    const width = +css("--togostanza-canvas-width");
    const height = +css("--togostanza-canvas-height");
    const root = this.root.querySelector("main");

    const xKeyName = this.params["axis-x-key"];
    const yKeyName = this.params["axis-y-key"];
    const xAxisTitle =
      typeof this.params["axis-x-title"] === "undefined"
        ? xKeyName
        : this.params["axis-x-title"];
    const yAxisTitle =
      typeof this.params["axis-y-title"] === "undefined"
        ? yKeyName
        : this.params["axis-y-title"];
    const groupKeyName = this.params["grouping-key"];
    const grouingArrangement = this.params["grouping-arrangement"];

    const errorKeyName = this.params["error_bars-key"];
    const barColorKey = this.params["color_by-key"];
    const tooltipKey = this.params["tooltips-key"];

    const colorSym: unique symbol = Symbol("color");
    const tooltipSym = Symbol("tooltip");
    const y1Sym = Symbol("y1");
    const y2Sym = Symbol("y2");

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const values = this._data;

    this._data.forEach((d) => {
      d[yKeyName] = +d[yKeyName];
      d[y1Sym] = 0;
      d[y2Sym] = d[yKeyName];
    });

    const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];

    const yAxisDomain = d3.extent(values, (d) => +d[yKeyName]);

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    this._groupedData = values.reduce((map: Map<any, {}[]>, curr) => {
      if (!map.has(curr[groupKeyName])) {
        return map.set(curr[groupKeyName], [curr]);
      }
      map.get(curr[groupKeyName]).push(curr);
      return map;
    }, new Map());

    this._dataByX = values.reduce((map, curr) => {
      if (!map.has(curr[xKeyName])) {
        return map.set(curr[xKeyName], [curr]);
      }
      map.get(curr[xKeyName]).push(curr);
      return map;
    }, new Map());

    const groupNames = this._groupedData.keys() as Iterable<string>;

    color.domain(groupNames);

    values.forEach((d) => {
      d[colorSym] = d[barColorKey] ?? color(d[groupKeyName]);
      console.log("bar color", color(d[groupKeyName]));
      d[tooltipSym] = d[tooltipKey] || null;
    });

    let svg = d3.select(root.querySelector("svg"));

    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = d3.select(root).append("svg");
    svg.attr("width", width).attr("height", height);

    this._graphArea = svg.append("g").attr("class", "chart");

    const axisArea = { x: 0, y: 0, width, height };

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: xAxisLabels,
      drawArea: axisArea,
      margins: MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: xAxisTitle,
      titlePadding: params["axis-x-title_padding"],
      scale: "ordinal",
      gridInterval: params["axis-x-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-x-ticks_interval"],
      ticksIntervalUnits: params["axis-x-ticks_interval_units"],
      ticksLabelsFormat: params["axis-x-ticks_labels_format"],
    };

    const yParams: AxisParamsI = {
      placement: params["axis-y-placement"],
      domain: yAxisDomain,
      drawArea: axisArea,
      margins: MARGIN,
      tickLabelsAngle: params["axis-y-ticks_label_angle"],
      title: yAxisTitle,
      titlePadding: params["axis-y-title_padding"],
      scale: "linear",
      gridInterval: params["axis-y-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-y-ticks_interval"],
      ticksIntervalUnits: params["axis-y-ticks_interval_units"],
      ticksLabelsFormat: params["axis-y-ticks_labels_format"],
    };

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }

    this.xAxisGen.update(xParams);
    this.yAxisGen.update(yParams);

    //data

    this._graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    switch (grouingArrangement) {
      case "stacked":
        drawStackedBars.apply(this, [{ colorSym, y1Sym, y2Sym }]);
        break;
      default:
        drawGroupedBars.apply(this, [{ y1Sym, y2Sym, groupKeyName, colorSym }]);
    }
  }
}

interface DrawFnParamsI {
  y1Sym: symbol;
  y2Sym: symbol;
  colorSym: symbol;
}

interface DrawGroupedFnI extends DrawFnParamsI {
  groupKeyName: string;
}

function drawGroupedBars(
  this: Barchart,
  { y1Sym, y2Sym, groupKeyName, colorSym }: DrawGroupedFnI
) {
  const xKeys = [...this._dataByX.keys()] as string[];
  const groupNames = [...this._groupedData.keys()] as string[];
  xKeys.forEach((key) => (xKeys[key] = "" + xKeys[key]));
  const bw = this.xAxisGen.axisGen.scale().bandwidth();
  const range = [0, bw];
  const groupScale = d3.scaleBand(range).domain(groupNames);

  groupScale.paddingInner(0.1).paddingOuter(0.2);
  const barGroups = this._graphArea
    .selectAll("g.bar-group")
    .data(this._dataByX);

  const barGroup = barGroups
    .enter()
    .append("g")
    .classed("bar-group", true)
    .attr("transform", (d) => {
      return `translate(${this.xAxisGen.axisGen.scale()(d[0])},0)`;
    });

  barGroup
    .selectAll("rect")
    .data((d) => d[1])
    .enter()
    .append("rect")
    .attr("y", (d) => this.yAxisGen.scale(d[y2Sym]))
    .attr("x", (d) => groupScale(d[groupKeyName]))
    .attr("width", groupScale.bandwidth())
    .attr(
      "height",
      (d) => this.yAxisGen.scale(0) - this.yAxisGen.scale(d[y2Sym])
    )
    .attr("fill", (d) => d[colorSym]);
}

function drawStackedBars(
  this: Barchart,
  { y1Sym, y2Sym, colorSym }: DrawFnParamsI
) {
  this._dataByX.forEach((val) => {
    for (let i = 1; i <= val.length - 1; i++) {
      val[i][y1Sym] = val[i - 1][y2Sym];
      val[i][y2Sym] += val[i - 1][y2Sym];
    }
  });

  const barGroups = this._graphArea
    .selectAll("g.bar-group")
    .data(this._dataByX);

  const barGroup = barGroups
    .enter()
    .append("g")
    .classed("bar-group", true)
    .attr("transform", (d) => {
      return `translate(${this.xAxisGen.axisGen.scale()(d[0])},0)`;
    });

  const bw = this.xAxisGen.axisGen.scale().bandwidth();

  barGroup
    .selectAll("rect")
    .data((d) => d[1])
    .enter()
    .append("rect")
    .classed("stacked-bar", true)
    .attr("x", 0)
    .attr("y", (d) => this.yAxisGen.scale(d[y2Sym]))
    .attr("width", bw)
    .attr("height", (d) =>
      Math.abs(this.yAxisGen.scale(d[y1Sym]) - this.yAxisGen.scale(d[y2Sym]))
    )
    .attr("fill", (d) => d[colorSym]);
}
