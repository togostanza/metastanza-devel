import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import { Axis, paramsModel } from "../../lib/AxisMixin";

import { getMarginsFromCSSString } from "../../lib/utils";
import { StanzaColorGenerator } from "@/lib/ColorGenerator";

import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

class TestBarchart extends Stanza {
  _data;
  xAxisGen;

  yAxisGen;

  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
    ];
  }

  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const colorGenerator = new StanzaColorGenerator(this);

    if (this.interval) {
      clearInterval(this.interval);
    }

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
    const errorKeyName = this.params["error_bars-key"];

    this._data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const values = this._data;

    const togostanzaColors = colorGenerator.stanzaColor;

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }

    let svg = d3.select(root.querySelector("svg"));

    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = d3.select(root).append("svg");
    svg.attr("width", width).attr("height", height);
    const graphArea = svg.append("g").attr("class", "chart");

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }

    const axisArea = { x: 0, y: 0, width, height };

    const barsArea = graphArea.append("g").attr("class", "bars");
    const barsGroups = barsArea.append("g").attr("class", "bars-group");

    const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
    const gSubKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];
    const color = d3
      .scaleOrdinal()
      .domain(gSubKeyNames)
      .range(togostanzaColors);

    const stack = d3.stack().keys(gSubKeyNames);
    const dataset = [];
    for (const entry of d3.group(values, (d) => d[xKeyName]).entries()) {
      dataset.push({
        x: entry[0],
        ...Object.fromEntries(
          entry[1].map((d) => [d[groupKeyName], d[yKeyName]])
        ),
      });
    }
    const stackedData = stack(dataset);
    const dataMax = d3.max(stackedData.flat(), (d) => d[1]);
    const yDomain = [0, dataMax * 1.05];

    const xParams = {
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

    const yParams = {
      placement: params["axis-y-placement"],
      domain: yDomain,
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

    this.xAxisGen.update(xParams);
    this.yAxisGen.update(yParams);

    graphArea.attr(
      "transform",
      `translate(${this.xAxisGen.axisArea.x},${this.xAxisGen.axisArea.y})`
    );

    stackedData.forEach((item) => {
      item.forEach((d) => (d.key = item.key));
    });

    const gs = barsGroups
      .selectAll("rect")
      .data(stackedData.flat(), (d) => `${d.key}-${d[0][xKeyName]}`);

    gs.join(
      (enter) =>
        enter
          .append("rect")
          .attr("fill", (d) => color(d.key))
          .attr("x", (d) => this.xAxisGen.scale(d.data.x))
          .attr("y", (d) => this.yAxisGen.scale(d[1]))
          .attr("width", this.xAxisGen.scale.bandwidth())
          .attr("height", (d) => {
            if (d[1]) {
              return this.yAxisGen.scale(d[0]) - this.yAxisGen.scale(d[1]);
            }
            return 0;
          }),
      (update) => update,
      (exit) => exit.remove()
    );
  }
}

export default TestBarchart;
