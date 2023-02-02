import ToolTip from "../../lib/ToolTip";
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
  appendCustomCss,
} from "togostanza-utils";
import { DSV, extent, scaleBand, scaleOrdinal, select } from "d3";

type TBarGroupSelection = {
  barGroup: d3.Selection<SVGGElement, {}, any, any>;
  groupScale: d3.ScaleBand<string>;
};

export default class Barchart extends StanzaSuperClass {
  xAxisGen: Axis;
  yAxisGen: Axis;
  _graphArea: d3.Selection<SVGGElement, {}, SVGElement, any>;
  _dataByGroup: Map<string | number, {}[]>;
  _dataByX: Map<string | number, {}[]>;
  legend: Legend;
  tooltips: ToolTip;

  menu() {
    return [
      downloadSvgMenuItem(this, "barchart"),
      downloadPngMenuItem(this, "barchart"),
      downloadJSONMenuItem(this, "barchart", this._data),
      downloadCSVMenuItem(this, "barchart", this._data),
      downloadTSVMenuItem(this, "barchart", this._data),
    ];
  }

  async renderNext() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key: string) =>
      getComputedStyle(this.element).getPropertyValue(key);

    const colorGenerator = new StanzaColorGenerator(this);
    const togostanzaColors = colorGenerator.stanzaColor;

    const color = scaleOrdinal().range(togostanzaColors);

    const width = +css("--togostanza-canvas-width");
    const height = +css("--togostanza-canvas-height");

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
    const showErrorBars = this._data.some((d) => d[errorKeyName]);
    const barColorKey = this.params["color_by-key"];
    const tooltipKey = this.params["tooltips-key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];

    const colorSym: unique symbol = Symbol("color");
    const tooltipSym = Symbol("tooltip");
    const y1Sym = Symbol("y1");
    const y2Sym = Symbol("y2");

    const values = structuredClone(this._data);

    const xAxisLabels = [
      ...new Set(values.map((d) => d[xKeyName])),
    ] as string[];

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    this._dataByGroup = values.reduce((map: Map<any, {}[]>, curr) => {
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

    const groupNames = this._dataByGroup.keys() as Iterable<string>;

    color.domain(groupNames);

    values.forEach((d) => {
      d[colorSym] = d[barColorKey] ?? color(d[groupKeyName]);
      d[tooltipSym] = d[tooltipKey] || null;
      d[yKeyName] = +d[yKeyName];
      d[y1Sym] = 0;
      d[y2Sym] = d[yKeyName];
    });

    let y2s = [];

    if (grouingArrangement === "stacked") {
      this._dataByX.forEach((val) => {
        for (let i = 1; i <= val.length - 1; i++) {
          val[i][y1Sym] = val[i - 1][y2Sym];
          val[i][y2Sym] += val[i - 1][y2Sym];
        }
      });

      y2s = [...this._dataByX.values()].flat().map((d) => d[y2Sym]);
    } else {
      if (showErrorBars) {
        y2s = [...this._dataByX.values()]
          .flat()
          .map((d) => (d[errorKeyName] ? d[errorKeyName][1] : -Infinity));
      } else {
        y2s = [...this._dataByX.values()].flat().map((d) => d[y2Sym]);
      }
    }

    const maxY = Math.max(...y2s);

    const yDomain = [0, maxY * 1.02];

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

    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: xAxisLabels,
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

    this._graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    let barGroup: d3.Selection<
      SVGGElement,
      [string | number, {}[]],
      SVGGElement,
      {}
    >;
    let groupScale;

    switch (grouingArrangement) {
      case "stacked":
        ({ barGroup } = drawStackedBars.apply(this, [
          { colorSym, y1Sym, y2Sym, tooltipSym },
        ]));
        break;
      default:
        ({ barGroup, groupScale } = drawGroupedBars.apply(this, [
          { y1Sym, y2Sym, groupKeyName, colorSym, tooltipSym },
        ]));
        if (showErrorBars) {
          barGroup.call(
            addErrorBars.bind(this),
            errorKeyName,
            groupKeyName,
            groupScale
          );
        }
    }

    if (showLegend) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }

      const legendParams = {
        title: legendTitle,
        items: [...this._dataByGroup.entries()].map(([key]) => ({
          id: key,
          label: key,
          color: color("" + key),
          nodes: barGroup
            .selectAll("rect")
            .filter((d) => d[groupKeyName] === key)
            .nodes()
            .concat(
              barGroup
                .selectAll("line.error-bar")
                .filter((d) => d[groupKeyName] === key)
                .nodes()
            ),
          value: key,
        })),
      };

      this.legend.setup(legendParams);
    } else {
      this.legend?.remove();
      this.legend = null;
    }

    if (values.some((d) => d[tooltipSym])) {
      if (!this.tooltips) {
        this.tooltips = new ToolTip();
        this._main.append(this.tooltips);
      }
      this.tooltips.setup(this._main.querySelectorAll("[data-tooltip]"));
    }
  }
}

interface DrawFnParamsI {
  y1Sym: symbol;
  y2Sym: symbol;
  colorSym: symbol;
  tooltipSym: symbol;
}

interface DrawGroupedFnI extends DrawFnParamsI {
  groupKeyName: string;
}

function drawGroupedBars(
  this: Barchart,
  { y1Sym, y2Sym, groupKeyName, colorSym, tooltipSym }: DrawGroupedFnI
) {
  const xKeys = [...this._dataByX.keys()] as string[];
  const groupNames = [...this._dataByGroup.keys()] as string[];
  xKeys.forEach((key) => (xKeys[key] = "" + xKeys[key]));
  const bw = this.xAxisGen.axisGen.scale().bandwidth();
  const range = [0, bw];
  const groupScale = scaleBand(range).domain(groupNames);

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
      (d) => this.yAxisGen.scale(d[y1Sym]) - this.yAxisGen.scale(d[y2Sym])
    )
    .attr("fill", (d) => d[colorSym])
    .attr("data-tooltip", (d) => d[tooltipSym]);

  return { barGroup, groupScale };
}

function drawStackedBars(
  this: Barchart,
  { y1Sym, y2Sym, colorSym, tooltipSym }: DrawFnParamsI
) {
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
    .attr("fill", (d) => d[colorSym])
    .attr("data-tooltip", (d) => d[tooltipSym]);

  return { barGroup };
}

function addErrorBars(
  this: Barchart,
  rect: d3.Selection<SVGGElement, {}, any, any>,
  errorKeyName: string,
  groupKeyName: string,
  groupScale: d3.ScaleBand<string>
) {
  const rectEnter = rect
    .selectAll("line")
    .data((d) => d[1].filter((d1) => d1[errorKeyName]))
    .enter();

  rectEnter
    .append("line")
    .attr("class", "error-bar")
    .attr("y1", (d) => this.yAxisGen.scale(d[errorKeyName][0]))
    .attr("y2", (d) => this.yAxisGen.scale(d[errorKeyName][1]))
    .attr("x1", (d) => groupScale(d[groupKeyName]) + groupScale.bandwidth() / 2)
    .attr(
      "x2",
      (d) => groupScale(d[groupKeyName]) + groupScale.bandwidth() / 2
    );

  rectEnter
    .append("line")
    .attr("class", "error-bar")
    .attr("y1", (d) => this.yAxisGen.scale(d[errorKeyName][0]))
    .attr("y2", (d) => this.yAxisGen.scale(d[errorKeyName][0]))
    .attr("x1", (d) => groupScale(d[groupKeyName]))
    .attr("x2", (d) => groupScale(d[groupKeyName]) + groupScale.bandwidth());

  rectEnter
    .append("line")
    .attr("class", "error-bar")
    .attr("y1", (d) => this.yAxisGen.scale(d[errorKeyName][1]))
    .attr("y2", (d) => this.yAxisGen.scale(d[errorKeyName][1]))
    .attr("x1", (d) => groupScale(d[groupKeyName]))
    .attr("x2", (d) => groupScale(d[groupKeyName]) + groupScale.bandwidth());
}
