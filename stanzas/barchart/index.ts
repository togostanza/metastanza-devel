import { BaseType, bin, scaleBand, scaleOrdinal, select, Selection } from "d3";
import { AxisDomain } from "d3-axis";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { Axis, type AxisParamsI, paramsModel } from "../../lib/AxisMixin";
import getStanzaColors from "../../lib/ColorGenerator";
import Legend from "../../lib/Legend2";
import MetaStanza from "../../lib/MetaStanza";
import ToolTip from "../../lib/ToolTip";
import { emitSelectedEvent, toggleSelectedIdsMultiple } from "../../lib/utils";

export default class Barchart extends MetaStanza {
  xAxisGen: Axis;
  yAxisGen: Axis;
  _graphArea: d3.Selection<SVGGElement, {}, SVGElement, unknown>;
  _dataByGroup: Map<string | number, {}[]>;
  _dataByX: Map<string | number, {}[]>;
  legend: Legend;
  tooltips: ToolTip;
  selectedIds: Array<string | number> = [];

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

    const tooltipString = this.params["tooltip"];

    if (tooltipString) {
      if (!this.tooltips) {
        this.tooltips = new ToolTip();
        this._main.append(this.tooltips);
      }

      this.tooltips.setTemplate(tooltipString);
    }

    // If "binKey" is specified, this component behaves as a histogram; if not, it behaves as a bar chart.
    switch (this.params["data-interpretation"]) {
      case "categorical":
        this.drawBarChart(svg);
        break;
      case "distribution":
        this.drawHistogram(svg);
        break;
    }
  }

  drawBarChart(svg: Selection<SVGSVGElement, unknown, null, undefined>) {
    const color = scaleOrdinal().range(getStanzaColors(this));

    const xKeyName = this.params["axis-x-key"];
    const yKeyName = this.params["axis-y-key"];
    const groupKeyName = this.params["group-key"];
    const grouingArrangement = this.params["group-arrangement"];

    const errorKeyName = this.params["errorbar-key"];
    const showErrorBars = this._data.some((d) => d[errorKeyName]);
    const barColorKey = this.params["node-color_key"];
    const tooltipKey = this.params["tooltips-key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];

    const colorSym: unique symbol = Symbol("color");
    const tooltipSym = Symbol("tooltip");
    const y1Sym = Symbol("y1");
    const y2Sym = Symbol("y2");

    const values = structuredClone(this._data);

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    this._dataByGroup = values.reduce(
      (map: Map<unknown, {}[]>, curr: { [x: string]: unknown }) => {
        if (!map.has(curr[groupKeyName])) {
          return map.set(curr[groupKeyName], [curr]);
        }
        map.get(curr[groupKeyName]).push(curr);
        return map;
      },
      new Map()
    );

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

    this._graphArea = svg.append("g").attr("class", "chart");

    const xParams: AxisParamsI = getXAxisParams.apply(this, [
      [
        ...new Set(structuredClone(this._data).map((d) => d[xKeyName])),
      ] as string[],
      "ordinal",
    ]);

    const maxY = Math.max(...y2s);
    const yDomain = [0, maxY * 1.02];

    const yParams: AxisParamsI = getYAxis.apply(this, [yDomain]);

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
        emitSelectedEventByBarChart.apply(this, [
          d[1][0]["__togostanza_id__"],
          this.params["data-url"],
        ])
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

    if (this.tooltips) {
      this.tooltips.setup(this._main.querySelectorAll("[data-tooltip]"));
    }
  }

  drawHistogram(svg: Selection<SVGSVGElement, unknown, null, undefined>) {
    const xKeyName = this.params["axis-x-key"];

    const values: Record<string, number>[] = structuredClone(this._data);

    try {
      paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    const data = values.map((d) => +d[xKeyName]);
    const height =
      +this.css("--togostanza-canvas-height") -
      this.MARGIN.TOP -
      this.MARGIN.BOTTOM;

    this._graphArea = svg.append("g").attr("class", "chart");

    // ビンの設定
    const bins = bin().thresholds(+this.params["data-bin-count"] || 10)(data);

    bins.forEach((bin) => {
      // 各ビンにデータ元のデータを追加
      bin["__values__"] = values.filter(
        (value) => value[xKeyName] >= bin.x0 && value[xKeyName] < bin.x1
      );
    });

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }

    // X軸のスケールをビンのデータに合わせて設定
    const xAxisDomain = [bins[0].x0, bins.at(-1).x1];
    const xParams = getXAxisParams.apply(this, [xAxisDomain, "linear"]);

    this.xAxisGen.update(xParams);

    // Y軸のスケールをビンのデータに合わせて設定
    const yParams = getYAxis.apply(this, [
      [0, Math.max(...bins.map((d) => d.length)) * 1.02],
    ]);

    this.yAxisGen.update(yParams);

    this._graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    // バーを描画
    const bar = this._graphArea
      .selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr(
        "transform",
        (d) => `translate(${this.xAxisGen.axisGen.scale()(d.x0) + 1},0)`
      );

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    const fill = css("--togostanza-theme-series_0_color");

    bar
      .append("rect")
      .attr("y", (d) => this.yAxisGen.scale(d.length))
      .attr(
        "width",
        this.xAxisGen.scale(bins[0].x1) - this.xAxisGen.scale(bins[0].x0) - 2
      )
      .attr("height", (d) => height - this.yAxisGen.scale(d.length))
      .attr("fill", fill);

    if (this.params["event-outgoing_change_selected_nodes"]) {
      bar.on("click", (_, d) => {
        const ids = d["__values__"].map((value) => value["__togostanza_id__"]);
        toggleSelectedIdsMultiple({
          selectedIds: this.selectedIds,
          targetIds: ids,
        });

        emitSelectedEventByHistogram.apply(this, [
          this.selectedIds,
          this.params["data-url"],
        ]);
      });
    }
  }

  handleEvent(event) {
    const { selectedIds, dataUrl } = event.detail;
    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      changeSelectedStyle.apply(this, [selectedIds]);
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
    .attr(
      "transform",
      (d) => `translate(${this.xAxisGen.axisGen.scale()(d[0])},0)`
    );

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
    .attr("data-tooltip", (d) => {
      if (this.tooltips) {
        return this.tooltips.compile(d);
      } else {
        return false;
      }
    });

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
    .attr("data-tooltip", (d) => {
      if (this.tooltips) {
        return this.tooltips.compile(d);
      } else {
        return false;
      }
    });

  return { barGroup };
}

function addErrorBars(
  this: Barchart,
  rect: d3.Selection<SVGGElement, {}, BaseType, unknown>,
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
function emitSelectedEventByBarChart(
  this: Barchart,
  id: unknown,
  dataUrl: string
) {
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
  emitSelectedEvent({
    rootElement: this.element,
    targetId: id,
    selectedIds: ids,
    dataUrl,
  });
  changeSelectedStyle.apply(this, [ids]);
}
function emitSelectedEventByHistogram(
  this: Barchart,
  ids: unknown[],
  dataUrl: string
) {
  // dispatch event
  emitSelectedEvent({
    rootElement: this.element,
    targetId: ids[0],
    selectedIds: ids,
    dataUrl,
  });

  changeSelectedStyle.apply(this, [ids]);
}

function changeSelectedStyle(this: Barchart, ids: (string | number)[]) {
  switch (this.params["data-interpretation"]) {
    case "categorical":
      {
        const barGroups = this._graphArea.selectAll("g.bar-group");
        barGroups.classed(
          "-selected",
          (d) => ids.indexOf(d[1][0].__togostanza_id__) !== -1
        );
      }
      break;
    case "distribution":
      {
        const bars = this._graphArea.selectAll("g.bar");
        bars.classed("-selected", (d) =>
          d["__values__"].some((value) =>
            ids.includes(value["__togostanza_id__"])
          )
        );
      }
      break;
  }
}

/**
 *
 * @param this - Barchart instance
 * @param domain - [min, max] of the x-axis
 * @param scale
 * @returns params object for Axis's update method
 */
function getXAxisParams(
  this: Barchart,
  domain: AxisDomain[],
  scale: "linear" | "time" | "log10" | "ordinal"
) {
  const xKeyName = this.params["axis-x-key"];
  const xAxisTitle =
    typeof this.params["axis-x-title"] === "undefined"
      ? xKeyName
      : this.params["axis-x-title"];

  const xParams: AxisParamsI = {
    placement: this.params["axis-x-placement"],
    domain,
    drawArea: {
      x: 0,
      y: 0,
      width: +this.css("--togostanza-canvas-width"),
      height: +this.css("--togostanza-canvas-height"),
    },
    margins: this.MARGIN,
    tickLabelsAngle: this.params["axis-x-ticks_label_angle"],
    title: xAxisTitle,
    titlePadding: this.params["axis-x-title_padding"],
    scale,
    gridInterval: this.params["axis-x-gridlines_interval"],
    gridIntervalUnits: this.params["axis-x-gridlines_interval_units"],
    ticksInterval: this.params["axis-x-ticks_interval"],
    ticksIntervalUnits: this.params["axis-x-ticks_interval_units"],
    ticksLabelsFormat: this.params["axis-x-ticks_labels_format"],
  };

  return xParams;
}

/**
 *
 * @param this - Barchart instance
 * @param domain - [min, max] of the y-axis
 * @returns params object for Axis's update method
 */
function getYAxis(this: Barchart, domain: AxisDomain[]) {
  const yKeyName = this.params["axis-y-key"];
  const yAxisTitle =
    typeof this.params["axis-y-title"] === "undefined"
      ? yKeyName
      : this.params["axis-y-title"];

  const yParams: AxisParamsI = {
    placement: this.params["axis-y-placement"],
    domain,
    drawArea: {
      x: 0,
      y: 0,
      width: +this.css("--togostanza-canvas-width"),
      height: +this.css("--togostanza-canvas-height"),
    },
    margins: this.MARGIN,
    tickLabelsAngle: this.params["axis-y-ticks_label_angle"],
    title: yAxisTitle,
    titlePadding: this.params["axis-y-title_padding"],
    scale: "linear",
    gridInterval: this.params["axis-y-gridlines_interval"],
    gridIntervalUnits: this.params["axis-x-gridlines_interval_units"],
    ticksInterval: this.params["axis-y-ticks_interval"],
    ticksIntervalUnits: this.params["axis-y-ticks_interval_units"],
    ticksLabelsFormat: this.params["axis-y-ticks_labels_format"],
  };
  return yParams;
}
