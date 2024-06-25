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
import { handleApiError, type LegendItem } from "../../lib/apiError";
import {
  emitSelectedEvent,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";

export default class Piechart extends MetaStanza {
  legend: Legend;
  _chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
  selectedIds: Array<string | number> = [];
  selectedEventParams = {
    targetElementSelector: ".pie-slice",
    selectedElementClassName: "-selected",
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

    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    let chartG: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
    const drawContent = () => {
      this._chartArea = select(this._main).select("svg");
      if (this._chartArea.empty()) {
        this._chartArea = select(this._main).append("svg");
      }

      this._chartArea.attr("width", width).attr("height", height);

      const existingChart = this._chartArea.select("g.chart");
      if (!existingChart.empty()) {
        existingChart.remove();
      }
      chartG = this._chartArea.append("g").classed("chart", true);
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


        pieGroups.on("mouseenter", function () {
          const node = select(this);
          pieGroups.classed("-fadeout", true);
          node.classed("-fadeout", false);
        });
        pieGroups.on("mouseleave", function () {
          pieGroups.classed("-fadeout", false);
        });

      pieGroups.on("click", (_, d) => {
        toggleSelectIds({
          selectedIds: this.selectedIds,
          targetId: d.data["__togostanza_id__"],
        });
        updateSelectedElementClassNameForD3({
          drawing: this._chartArea,
          selectedIds: this.selectedIds,
          ...this.selectedEventParams,
        });
        if (this.params["event-outgoing_change_selected_nodes"]) {
          emitSelectedEvent({
            rootElement: this.element,
            selectedIds: this.selectedIds,
            targetId: d.data["__togostanza_id__"],
            dataUrl: this.params["data-url"],
          });
        }
      });
    };

    const isLegendVisible: boolean = this.params["legend-visible"];

    const legendConfiguration = {
      items: this._data.map((item: string, index: number) => {
        return {
          id: "" + index,
          value: item[categoryKey],
          color: item[colorSym],
          toggled: false,
        } as LegendItem;
      }),
      title: legendTitle,
      options: {
        fadeoutNodes: chartG?.selectAll(".pie-slice").nodes(),
        fadeProp: "opacity",
        showLeaders: false,
      },
    };

    handleApiError({
      stanzaData: this,
      drawContent,
      hasLegend: true,
      legendOptions: {
        isLegendVisible,
        legendConfiguration,
      },
    });
  }

  handleEvent(event) {
    const { selectedIds, dataUrl } = event.detail;

    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      updateSelectedElementClassNameForD3({
        drawing: this._chartArea,
        selectedIds,
        ...this.selectedEventParams,
      });
    }
  }
}
