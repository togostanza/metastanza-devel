import { select, pie, arc, scaleOrdinal, DefaultArcObject } from "d3";
import { StanzaColorGenerator } from "../../lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import ToolTip from "../../lib/ToolTip";
import Legend from "../../lib/Legend2";
import MetaStanza from "../../lib/MetaStanza";

export default class Piechart extends MetaStanza {
  legend: Legend;

  menu() {
    return [
      downloadSvgMenuItem(this, "piechart"),
      downloadPngMenuItem(this, "piechart"),
      downloadJSONMenuItem(this, "piechart", this._data),
      downloadCSVMenuItem(this, "piechart", this._data),
      downloadTSVMenuItem(this, "piechart", this._data),
    ];
  }

  async renderNext() {
    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));
    const valueKey = this.params["data-value_key"];
    const categoryKey = this.params["data-category_key"];
    const colorKey = this.params["data-color_key"];
    const showLegend = this.params["legend-visible"];
    const legendTitle = this.params["legend-title"];

    const cg = new StanzaColorGenerator(this);
    const categoryList = [
      ...new Set(this._data.map((d) => d[categoryKey])),
    ] as string[];

    const color = scaleOrdinal(cg.stanzaColor).domain(categoryList);

    const colorSym = Symbol("color");
    this._data.forEach((d: string | number) => {
      d[valueKey] = +d[valueKey];
      d[colorSym] = d[colorKey] ?? color(d[categoryKey]);
    });

    let svg = select(this._main).select("svg");
    if (svg.empty()) {
      svg = select(this._main).append("svg");
    }

    svg.attr("width", width).attr("height", height);

    const existingChart = svg.select("g.chart");
    if (!existingChart.empty()) {
      existingChart.remove();
    }
    const chartG = svg.append("g").classed("chart", true);
    chartG.attr("transform", `translate(${width / 2},${height / 2})`);

    const WIDTH = width - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    const HEIGHT = height - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    const R = Math.min(WIDTH, HEIGHT) / 2;

    const arcGenerator = arc().innerRadius(0).outerRadius(R);

    const pieConvertor = pie().value((d) => d[valueKey]);

    const dataReady = pieConvertor(this._data);

    const chart = chartG.selectAll("path").data(dataReady);

    chart
      .enter()
      .append("path")
      .classed("pie-slice", true)
      .attr("d", <any>arcGenerator)
      .attr("fill", (d) => d.data[colorSym]);

    if (showLegend) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }

      this.legend.items = this._data.map((item: string, index: number) => {
        return {
          id: "" + index,
          value: item[categoryKey],
          color: item[colorSym],
          toggled: false,
        };
      });

      this.legend.nodes = this._data.map((item, index) => {
        return {
          id: "" + index,
          node: chartG
            .selectAll(".pie-slice")
            .filter(
              (d: (typeof dataReady)[number]) =>
                d.data[categoryKey] === item[categoryKey]
            )
            .nodes(),
        };
      });

      this.legend.options = {
        fadeoutNodes: chartG.selectAll(".pie-slice").nodes(),
        fadeProp: "opacity",
        showLeaders: false,
      };

      this.legend.title = legendTitle;
    } else {
      this.legend.remove();
      this.legend = null;
    }
  }
}
