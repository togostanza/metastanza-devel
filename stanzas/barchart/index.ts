import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend2";
import { Axis, type AxisParamsI, paramsModel } from "../../lib/AxisMixin";
import MetaStanza from "../../lib/MetaStanza";

import getStanzaColors from "../../lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import {
  scaleBand,
  scaleOrdinal,
  scaleLinear,
  select,
  bin,
  max,
  axisBottom,
  axisLeft,
} from "d3";

export default class Barchart extends MetaStanza {
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
    // If "binKey" is specified, this component behaves as a histogram; if not, it behaves as a bar chart.
    switch (this.params["data-interpretation"]) {
      case "categorical":
        this.drawBarChart();
        break;
      case "distribution":
        this.drawHistogram();
        break;
    }
  }

  drawBarChart() {
    const color = scaleOrdinal().range(getStanzaColors(this));

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
    console.log(xAxisLabels);

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
    console.log(this._dataByX);

    const groupNames = this._dataByGroup.keys() as Iterable<string>;

    color.domain(groupNames);

    values.forEach((d) => {
      d[colorSym] = d[barColorKey] ?? color(d[groupKeyName]);
      d[tooltipSym] = d[tooltipKey] || null;
      d[yKeyName] = +d[yKeyName];
      d[y1Sym] = 0;
      d[y2Sym] = d[yKeyName];
    });
    console.log(values);

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
    if (this.params["event-outgoing_change_selected_nodes"]) {
      barGroup.on("click", (_, d) =>
        emitSelectedEvent.apply(this, [d[1][0]["__togostanza_id__"]])
      );
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

  drawHistogram() {
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

    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];

    const numberOfBin = 20;

    const values = structuredClone(this._data);
    console.log(values);

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }
    console.log(params);

    const data = values.map((d) => +d[xKeyName]);
    console.log(data);

    // const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width =
      +this.css("--togostanza-canvas-width") - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    const height =
      +this.css("--togostanza-canvas-height") - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    let svg = select(this._main.querySelector("svg"));
    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = select(this._main).append("svg");
    svg
      .attr("width", +this.css("--togostanza-canvas-width"))
      .attr("height", +this.css("--togostanza-canvas-height"));

    this._graphArea = svg.append("g").attr("class", "chart");

    // X軸とY軸のスケールを設定
    const x = scaleLinear()
      .domain([Math.min(...data), Math.max(...data)]) // データの範囲に合わせて調整
      .rangeRound([0, width]);
    const y = scaleLinear().range([height, 0]);

    // ビンの設定
    const bins = bin()
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(numberOfBin))(
      // 20個のビンに分ける
      data
    );
    console.log(bins);

    // Y軸のスケールをビンのデータに合わせて設定
    y.domain([0, max(bins, (d) => d.length)]);

    const axisArea = {
      x: 0,
      y: 0,
      width: +this.css("--togostanza-canvas-width"),
      height: +this.css("--togostanza-canvas-height"),
    };

    // X軸を追加
    console.log(this.MARGIN);
    const xParams: AxisParamsI = {
      placement: params["axis-x-placement"],
      domain: [Math.min(...data), Math.max(...data)],
      drawArea: axisArea,
      margins: this.MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: xAxisTitle,
      titlePadding: params["axis-x-title_padding"],
      scale: "linear",
      gridInterval: params["axis-x-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-x-ticks_interval"],
      ticksIntervalUnits: params["axis-x-ticks_interval_units"],
      ticksLabelsFormat: params["axis-x-ticks_labels_format"],
    };
    console.log(xParams)
    const maxY = bins.reduce(
      (acc, bin) => (bin.length > acc ? bin.length : acc),
      0
    );
    const yDomain = [0, maxY * 1.02];
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
    // const g = svg
    //   .append("g")
    //   .attr("transform", `translate(${margin.left},${margin.top})`);

    // g.append("g")
    //   .attr("class", "axis axis--x")
    //   .attr("transform", `translate(0,${height})`)
    //   .call(axisBottom(x));

    // Y軸を追加
    // g.append("g").attr("class", "axis axis--y").call(axisLeft(y));

    // バーを描画
    console.log(this.xAxisGen.axisGen)
    console.log(this.xAxisGen.axisGen.scale())
    const bar = this._graphArea
      .selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr(
        "transform",
        (d) => {
          console.log(d)
          console.log( this.xAxisGen.axisGen.scale()(d.x0) )
          return `translate(${this.xAxisGen.axisGen.scale()(d.x0)},0)`}
      );

    bar
      .append("rect")
      .attr("y", (d) => y(d.length))
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", (d) => height - y(d.length))
      .attr("fill", "steelblue");
  }

  handleEvent(event) {
    if (this.params["event-incoming_change_selected_nodes"]) {
      changeSelectedStyle.apply(this, [event.detail]);
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
    .attr("transform", (d) => `translate(${this.xAxisGen.axisGen.scale()(d[0])},0)`);

  barGroup
    .selectAll("rect")
    .data((d) => {
      return d[1];
    })
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
      console.log(d);
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

// emit selected event
function emitSelectedEvent(this: Barchart, id: any) {
  // collect selected bars
  const barGroups = this._graphArea.selectAll("g.bar-group");
  const filteredBars = barGroups.filter(".-selected");
  const ids = filteredBars
    .data()
    .map((datum) => datum[1][0]["__togostanza_id__"]);
  const indexInSelectedBars = ids.indexOf(id);
  if (indexInSelectedBars === -1) {
    ids.push(id);
  } else {
    ids.splice(indexInSelectedBars, 1);
  }
  // dispatch event
  this.element.dispatchEvent(
    new CustomEvent("changeSelectedNodes", {
      detail: ids,
    })
  );
  changeSelectedStyle.apply(this, [ids]);
}

function changeSelectedStyle(this: Barchart, ids: string[]) {
  console.log(ids);
  const barGroups = this._graphArea.selectAll("g.bar-group");
  barGroups.classed(
    "-selected",
    (d) => ids.indexOf(d[1][0].__togostanza_id__) !== -1
  );
}
