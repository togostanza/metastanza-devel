import Legend from "../../lib/Legend2";
import { Axis, type AxisParamsI, paramsModel } from "../../lib/AxisMixin";
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
    const errorKey = this.params["error_bars-key"];
    const showErrorBars = this._data.some((d) => d[errorKey]);
    const tooltipKey = this.params["tooltips-key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];
    const values = structuredClone(this._data) as any[];

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

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

    color.domain(this._dataByGroup.keys());

    this._dataByGroup.forEach((value, key) => {
      value.color = color(key) as string;
    });

    const xSym = Symbol("x");
    const ySym = Symbol("y");
    const colorSym = Symbol("color");
    const errorSym = Symbol("error");

    const symbols = {
      xSym,
      ySym,
      colorSym,
      errorSym,
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

    const xScaleType = "ordinal";

    let xDomain = [];
    if (xScaleType === "ordinal") {
      xDomain = values.map((d) => d[xKeyName]);
    } else {
      xDomain = extent(values.map((d) => d[xKeyName]));
    }

    const yDomain = extent(values.map((d) => +d[yKeyName]));

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: xDomain,
      drawArea: axisArea,
      margins: this.MARGIN,
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

    console.log(this._dataByGroup);

    const lines = drawChart(this._graphArea, this._dataByGroup, symbols);

    lines.call(addErrorBars);
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

  const symbolGen = symbol().type(symbolCircle).size(20);

  const update = g.selectAll("g.chart-line-group").data(dataMap);

  const enter = update.enter().append("g").classed("chart-line-group", true);

  enter
    .append("path")
    .classed("chart-line", true)
    .attr("stroke", (d) => {
      console.log(d[1]);
      return d[1].color;
    })
    .attr("d", (d) => lineGen(d[1].values));

  const updateSymbols = enter.selectAll("g.symbol-g").data((d) => d[1].values);

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

  return enter;
}

function addErrorBars(chartGroup: TGSelection) {
  const errorsGroup = chartGroup.append("g").classed("error-bars-group");

  console.log(this);
}
