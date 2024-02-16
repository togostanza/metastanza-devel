import { arc, pie, scaleOrdinal, select } from "d3";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import getStanzaColors from "../../lib/ColorGenerator";
import Legend from "../../lib/Legend2";
import MetaStanza from "../../lib/MetaStanza";
import { emitSelectedEvent, changeSelectedStyle } from "../../lib/utils";

export default class Piechart extends MetaStanza {
  legend: Legend;
  _chartArea: d3.Selection<SVGGElement, {}, SVGElement, any>;
  selectedEventParams = {
    drawing: this,
    targetElementSelector: ".pie-slice",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "data.__togostanza_id__",
  };

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

    const categoryList = [
      ...new Set(this._data.map((d) => d[categoryKey])),
    ] as string[];

    const color = scaleOrdinal(getStanzaColors(this)).domain(categoryList);

    const colorSym = Symbol("color");
    this._data.forEach((d: string | number) => {
      d[valueKey] = +d[valueKey];
      d[colorSym] = d[colorKey] ?? color(d[categoryKey]);
    });

    this._chartArea = select(this._main).select("svg");
    if (this._chartArea.empty()) {
      this._chartArea = select(this._main).append("svg");
    }

    this._chartArea.attr("width", width).attr("height", height);

    const existingChart = this._chartArea.select("g.chart");
    if (!existingChart.empty()) {
      existingChart.remove();
    }
    const chartG = this._chartArea.append("g").classed("chart", true);
    chartG.attr("transform", `translate(${width / 2},${height / 2})`);

    const WIDTH = width - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    const HEIGHT = height - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    const R = Math.min(WIDTH, HEIGHT) / 2;

    const arcGenerator = arc().innerRadius(0).outerRadius(R);

    const pieConvertor = pie().value((d) => d[valueKey]);

    const dataReady = pieConvertor(this._data);

    const chart = chartG.selectAll("path").data(dataReady);

    const pieGroups = chart
      .enter()
      .append("path")
      .classed("pie-slice", true)
      .attr("d", <any>arcGenerator)
      .attr("fill", (d) => d.data[colorSym]);

    if (this.params["event-outgoing_change_selected_nodes"]) {
      pieGroups.on("click", (_, d) => {
        console.log(d.data);
        return emitSelectedEvent.apply(null, [
          {
            targetId: d.data["__togostanza_id__"],
            ...this.selectedEventParams,
          },
        ]);
      });
    }

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

  handleEvent(event) {
    if (this.params["event-incoming_change_selected_nodes"]) {
      changeSelectedStyle.apply(null, [
        {
          selectedIds: event.detail,
          ...this.selectedEventParams,
        },
      ]);
    }
  }
}
