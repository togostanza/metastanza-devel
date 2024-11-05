import { extent, line, scaleOrdinal, select, symbol, symbolCircle } from "d3";
import MetaStanza from "../../lib/MetaStanza";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import Legend from "../../lib/Legend2";
import ToolTip from "../../lib/ToolTip";
import {
  Axis,
  AxisScaleE,
  paramsModel,
  type AxisParamsI,
} from "../../lib/AxisMixin";
import getStanzaColors from "../../lib/ColorGenerator";
import { z } from "zod";
import { MarginsI } from "../../lib/utils";

type TSymbols = {
  xSym: symbol;
  ySym: symbol;
  colorSym: symbol;
  tooltipSym: symbol;
};

type TValueWithSymbols = {
  [key: string]: string | number | null;
  [key: symbol]: any;
};

interface IDataByGroup {
  color: string;
  values: TValueWithSymbols[];
}

type TDataByGroup = Map<string, IDataByGroup>;

type TGSelection = d3.Selection<
  SVGGElement,
  TDataByGroup,
  SVGElement,
  undefined
>;

export default class Linechart extends MetaStanza {
  xAxisGen: Axis;
  yAxisGen: Axis;
  legend: Legend;
  tooltips: ToolTip;
  graphArea: TGSelection;
  dataByGroup: TDataByGroup;

  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
    ];
  }

  async renderNext() {
    const color = scaleOrdinal().range(getStanzaColors(this));
    const width = +this.css("--togostanza-canvas-width");
    const height = +this.css("--togostanza-canvas-height");

    const xKeyName = this.params["axis-x-key"];
    const xScaleType = this.params["axis-x-scale"];
    const yKeyName = this.params["axis-y-key"];
    const yScaleType = this.params["axis-y-scale"];
    const yMin = this.params["axis-y-range_min"] as number | undefined;
    const yMax = this.params["axis-y-range_max"] as number | undefined;
    const xAxisTitle =
      typeof this.params["axis-x-title"] === "undefined"
        ? xKeyName
        : this.params["axis-x-title"];
    const yAxisTitle =
      typeof this.params["axis-y-title"] === "undefined"
        ? yKeyName
        : this.params["axis-y-title"];
    const groupKeyName = this.params["grouping-key"];
    const pointSize = this.params["point_size"];
    const tooltipKey = this.params["tooltips-key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle =
      typeof this.params["legend-title"] === "undefined"
        ? groupKeyName
        : this.params["legend-title"];

    let values = structuredClone(this._data) as any[];

    let params: z.infer<typeof paramsModel>;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    values = values.filter((value) => {
      const parsedXVal = parseType(value[xKeyName], xScaleType);
      const parsedYVal = parseType(value[yKeyName], yScaleType);
      if (parsedXVal && parsedYVal) {
        value[xKeyName] = parseType(value[xKeyName], xScaleType);
        value[yKeyName] = parseType(value[yKeyName], yScaleType);
      }
      return !!parsedXVal && !!parsedYVal;
    });

    this.dataByGroup = values.reduce((map: TDataByGroup, curr) => {
      if (!map.has(curr[groupKeyName])) {
        return map.set(curr[groupKeyName], {
          color: "",
          values: [curr],
        });
      }
      map.get(curr[groupKeyName]).values.push(curr);
      return map;
    }, new Map());

    color.domain(this.dataByGroup.keys());

    this.dataByGroup.forEach((value, key) => {
      value.color = color(key) as string;
    });

    const xSym = Symbol("x");
    const ySym = Symbol("y");
    const colorSym = Symbol("color");
    const tooltipSym = Symbol("tooltip");

    const symbols: TSymbols = {
      xSym,
      ySym,
      colorSym,
      tooltipSym,
    };

    let svg = select(this._main.querySelector("svg"));

    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = select(this._main).append("svg");
    svg.attr("width", width).attr("height", height);
    this.graphArea = svg.append("g").attr("class", "chart") as TGSelection;

    const axisArea = {
      x: this.MARGIN.LEFT,
      y: this.MARGIN.TOP,
      width: width - this.MARGIN.LEFT - this.MARGIN.RIGHT,
      height: height - this.MARGIN.TOP - this.MARGIN.BOTTOM,
    };

    const AxesMargins: MarginsI = {
      LEFT:
        params["axis-y-placement"] === "left"
          ? params["axis-y-title_padding"] || 0
          : 0,
      RIGHT:
        params["axis-y-placement"] === "right"
          ? params["axis-y-title_padding"] || 0
          : 0,
      TOP:
        params["axis-x-placement"] === "top"
          ? params["axis-x-title_padding"] || 0
          : 0,
      BOTTOM:
        params["axis-x-placement"] === "bottom"
          ? params["axis-x-title_padding"] || 0
          : 0,
    };

    let xDomain = [];
    if (xScaleType === "ordinal") {
      xDomain = [...new Set(values.map((d) => d[xKeyName]))];
    } else {
      xDomain = extent(values.map((d) => d[xKeyName]));
    }

    const yDomain = extent(values.map((d) => d[yKeyName]));

    if (yMin !== undefined) {
      yDomain[0] = yMin;
    }
    if (yMax !== undefined) {
      yDomain[1] = yMax;
    }

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: xDomain,
      drawArea: axisArea,
      margins: AxesMargins,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: xAxisTitle,
      titlePadding: params["axis-x-title_padding"],
      scale: params["axis-x-scale"],
      gridInterval: params["axis-x-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-x-ticks_interval"],
      ticksIntervalUnits: params["axis-x-ticks_interval_units"],
      ticksLabelsFormat: params["axis-x-ticks_labels_format"],
    };

    const yParams: AxisParamsI = {
      placement: params["axis-y-placement"],
      domain: yDomain,
      drawArea: axisArea,
      margins: AxesMargins,
      tickLabelsAngle: params["axis-y-ticks_label_angle"],
      title: yAxisTitle,
      titlePadding: params["axis-y-title_padding"],
      scale: params["axis-y-scale"],
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

    this.yAxisGen.axisArea;

    values.forEach((val) => {
      val[xSym] = this.xAxisGen.scale(val[xKeyName]);
      val[ySym] = this.yAxisGen.scale(val[yKeyName]);
      val[colorSym] = color(val[groupKeyName]);
      val[tooltipSym] = `${val[groupKeyName]}: ${val[tooltipKey]}`;
    });

    this.graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    const clipPath = svg.append("defs").append("clipPath").attr("id", "mask");
    clipPath
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.yAxisGen.axisArea.width)
      .attr("height", this.yAxisGen.axisArea.height)
      .attr("fill", "white");

    this.graphArea.attr("clip-path", "url(#mask)");

    const lines = drawChart(this.graphArea, this.dataByGroup, symbols);

    drawPoints(lines, pointSize, symbols);

    if (showLegend) {
      addLegend.call(this, legendTitle, lines);
    } else {
      this.legend?.remove();
      this.legend = null;
    }

    if (values.some((d) => d[tooltipKey])) {
      addTooltips.call(this);
    }
  }
}

function addLegend(legendTitle: string, lines: TGSelection) {
  if (!this.legend) {
    this.legend = new Legend();
    this.root.append(this.legend);
  }
  const legendParams = {
    title: legendTitle,
    items: [...this.dataByGroup.entries()].map(([key, val]) => ({
      id: key,
      label: key,
      color: val.color,
      nodes: [lines.filter((d) => d[0] === key).node()],
      value: key,
    })),
  };

  this.legend.setup(legendParams);
}

function addTooltips() {
  if (!this.tooltips) {
    this.tooltips = new ToolTip();
    this._main.append(this.tooltips);
  }
  this.tooltips.setup(this._main.querySelectorAll("[data-tooltip]"));
}

function drawChart(g: TGSelection, dataMap: TDataByGroup, symbols: TSymbols) {
  const lineGen = line<TValueWithSymbols>()
    .x((d) => d[symbols.xSym])
    .y((d) => d[symbols.ySym]);

  const update = g.selectAll("g.chart-line-group").data(Array.from(dataMap)); // here d3 converts map to [key, value] array

  const enter = update.enter().append("g").classed("chart-line-group", true);

  enter
    .append("path")
    .classed("chart-line", true)
    .attr("stroke", (d) => d[1].color)
    .attr("d", (d) => lineGen(d[1].values));

  return enter;
}

function drawPoints(
  lines: d3.Selection<
    SVGGElement,
    [string, IDataByGroup],
    SVGElement,
    undefined
  >,
  pointSize: number | undefined,
  symbols: TSymbols
) {
  const symbolGen = symbol()
    .type(symbolCircle)
    .size(typeof pointSize === "undefined" ? 20 : pointSize * pointSize);

  const updateSymbols = lines.selectAll("g.symbol-g").data((d) => d[1].values);

  const enterSymbols = updateSymbols
    .enter()
    .append("g")
    .classed("symbol-g", true)
    .attr(
      "transform",
      (d) => `translate(${d[symbols.xSym]}, ${d[symbols.ySym]})`
    );

  enterSymbols
    .append("path")
    .classed("symbol", true)
    .attr("d", symbolGen)
    .attr("fill", (d) => d[symbols.colorSym])
    .attr("data-tooltip", (d) => d[symbols.tooltipSym]);

  return enterSymbols;
}

function parseType(
  value: number | string | null | undefined,
  scaleType: AxisScaleE
) {
  switch (true) {
    case scaleType === AxisScaleE.linear || scaleType === AxisScaleE.log10:
      if (typeof value !== "number") {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
          return null;
        }
        return parsedValue;
      }
      return value;
    case scaleType === AxisScaleE.ordinal:
      return value;
    case scaleType === AxisScaleE.time: {
      const parsedDate = new Date(value);
      if (Object.prototype.toString.call(parsedDate) !== "[object Date]") {
        return null;
      }
      return parsedDate;
    }
    default:
      return value;
  }
}
