import Legend from "../../lib/Legend2";
import {
  Axis,
  type AxisParamsI,
  AxisScaleE,
  paramsModel,
} from "../../lib/AxisMixin";
import StanzaSuperClass from "../../lib/StanzaSuperClass";

import { StanzaColorGenerator } from "../../lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

import { extent, line, scaleOrdinal, select, symbol, symbolCircle } from "d3";

interface IDataByGroup {
  color: string;
  values: any[];
}

type TDataByGroup = Map<string, IDataByGroup>;

type TGSelection = d3.Selection<SVGGElement, {}, SVGElement, any>;

export default class Linechart extends StanzaSuperClass {
  xAxisGen: Axis;
  yAxisGen: Axis;
  legend: Legend;
  _graphArea: TGSelection;
  _dataByGroup: TDataByGroup;

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
    const colorGenerator = new StanzaColorGenerator(this);
    const togostanzaColors = colorGenerator.stanzaColor;
    const color = scaleOrdinal().range(togostanzaColors);
    const width = +this.css("--togostanza-canvas-width");
    const height = +this.css("--togostanza-canvas-height");

    const xKeyName = this.params["axis-x-key"];
    const xScaleType = this.params["axis-x-scale"];
    const yKeyName = this.params["axis-y-key"];
    const yScaleType = this.params["axis-y-scale"];
    const xAxisTitle =
      typeof this.params["axis-x-title"] === "undefined"
        ? xKeyName
        : this.params["axis-x-title"];
    const yAxisTitle =
      typeof this.params["axis-y-title"] === "undefined"
        ? yKeyName
        : this.params["axis-y-title"];
    const groupKeyName = this.params["grouping-key"];
    const pointSize = this.params["points_size"];
    const tooltipKey = this.params["tooltips-key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    let values = structuredClone(this._data) as any[];

    let params;
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

    this._dataByGroup = values.reduce((map: TDataByGroup, curr) => {
      if (!map.has(curr[groupKeyName])) {
        return map.set(curr[groupKeyName], {
          color: "",
          values: [curr],
        });
      }
      map.get(curr[groupKeyName]).values.push(curr);
      return map;
    }, new Map());

    console.log(this._dataByGroup);
    color.domain(this._dataByGroup.keys());

    this._dataByGroup.forEach((value, key) => {
      value.color = color(key) as string;
    });

    const xSym = Symbol("x");
    const ySym = Symbol("y");
    const colorSym = Symbol("color");

    const symbols = {
      xSym,
      ySym,
      colorSym,
    };

    let svg = select(this._main.querySelector("svg"));

    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = select(this._main).append("svg");
    svg.attr("width", width).attr("height", height);
    this._graphArea = svg.append("g").attr("class", "chart");
    const axisArea = { x: 0, y: 0, width, height };

    let xDomain = [];
    if (xScaleType === "ordinal") {
      xDomain = values.map((d) => d[xKeyName]);
    } else {
      xDomain = extent(values.map((d) => d[xKeyName]));
    }

    const yDomain = extent(values.map((d) => d[yKeyName]));

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: xDomain,
      drawArea: axisArea,
      margins: this.MARGIN,
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
      margins: this.MARGIN,
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

    values.forEach((val) => {
      val[xSym] = this.xAxisGen.scale(val[xKeyName]);
      val[ySym] = this.yAxisGen.scale(val[yKeyName]);
      val[colorSym] = color(val[groupKeyName]);
    });

    this._graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    const lines = drawChart(this._graphArea, this._dataByGroup, symbols);

    drawPoints(lines, pointSize, symbols);

    if (showLegend) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }

      const legendParams = {
        title: legendTitle,
        items: [...this._dataByGroup.entries()].map(([key, val]) => ({
          id: key,
          label: key,
          color: val.color,
          nodes: [lines.filter((d) => d[0] === key).node()],
          value: key,
        })),
      };

      this.legend.setup(legendParams);
    } else {
      this.legend?.remove();
      this.legend = null;
    }
  }
}

interface ISymbols {
  xSym: symbol;
  ySym: symbol;
  colorSym: symbol;
}

function drawChart(
  g: d3.Selection<SVGGElement, any, SVGElement, any>,
  dataMap: TDataByGroup,
  symbols: ISymbols
) {
  const lineGen = line()
    .x((d) => d[symbols.xSym])
    .y((d) => d[symbols.ySym]);

  const update = g.selectAll("g.chart-line-group").data(dataMap);

  const enter = update.enter().append("g").classed("chart-line-group", true);

  enter
    .append("path")
    .classed("chart-line", true)
    .attr("stroke", (d) => d[1].color)
    .attr("d", (d) => lineGen(d[1].values));

  return enter;
}

function drawPoints(
  lines: d3.Selection<SVGGElement, any, SVGElement, any>,
  pointSize: number | undefined,
  symbols: ISymbols
) {
  const symbolGen = symbol()
    .type(symbolCircle)
    .size(pointSize ? pointSize * pointSize : 20);

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
    .attr("fill", (d) => d[symbols.colorSym]);

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
    case scaleType === AxisScaleE.time:
      const parsedDate = new Date(value);
      if (Object.prototype.toString.call(parsedDate) !== "[object Date]") {
        return null;
      }
      return parsedDate;
    default:
      return value;
  }
}
