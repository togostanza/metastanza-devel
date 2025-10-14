import { arc, pie, scaleOrdinal, select, Arc, PieArcDatum } from "d3";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import getStanzaColors, { getCirculateColor } from "../../lib/ColorGenerator";
import MetaStanza, { METASTANZA_NODE_ID_KEY } from "../../lib/MetaStanza";
import { SelectionPlugin } from "../../lib/plugins/SelectionPlugin";
import { METASTANZA_DATA_ATTR } from "../../lib/MetaStanza";
import Legend from "../../lib/Legend2";
import ToolTip from "../../lib/ToolTip";

interface DataItem {
  [key: string]: string | number;
  __togostanza_id__: string | number;
}

export default class Piechart extends MetaStanza {
  _chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
  legend: Legend;
  tooltips: ToolTip;
  _selectionPlugin: SelectionPlugin;

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
    if (this._error) return;

    this._selectionPlugin = new SelectionPlugin({ stanza: this });
    this.use(this._selectionPlugin);
    const root = this._main;
    this._chartArea = select(this._main.querySelector("svg"));
    const width = parseInt(this.css("--togostanza-canvas-width"));
    const height = parseInt(this.css("--togostanza-canvas-height"));
    const valueKey = this.params["data-value_key"];
    const categoryKey = this.params["data-category_key"];
    const colorKey = this.params["color-key"].trim();
    const groupKey = this.params["group-key"].trim();

    const legendTitle = this.params["legend-title"];

    const hasGroup = this._data.some((d) => d[groupKey]);

    const categoryList = [
      ...new Set(this._data.map((d: DataItem) => d[categoryKey])),
    ] as string[];

    const defaultColorScale = scaleOrdinal(getStanzaColors(this)).domain(
      categoryList
    );

    // groupベースのカラー取得用
    const groupColorScale = hasGroup
      ? getCirculateColor(this, this._data, groupKey).groupColor
      : null;

    /** カラー取得関数
     * 優先順位:
     * 1. color プロパティがあればそれを使う
     * 2. group プロパティがあれば groupColorScale を使う
     * 3. それ以外は category ベースの defaultColorScale を使う */
    const setColorFromRawData = (d: DataItem) => {
      const color = d[colorKey];
      if (color) {
        return color;
      }

      const group = d[groupKey];
      if (hasGroup && groupColorScale && group) {
        return groupColorScale(group);
      }

      return defaultColorScale(String(d[categoryKey]));
    };

    const COLOR_KEY = "__color";
    this._data.forEach((d: DataItem) => {
      d[valueKey] = +d[valueKey];
      d[COLOR_KEY] = setColorFromRawData(d);
    });

    // Tooltip
    const tooltipString = this.params["tooltip"];

    if (!this._chartArea?.empty()) {
      this._chartArea?.remove();
    }

    let chartG: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;

    const drawContent = async () => {
      // Drawing svg
      this._chartArea = select(root)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // Append tooltips
      if (tooltipString) {
        if (!this.tooltips) {
          this.tooltips = new ToolTip();
          root.append(this.tooltips);
        }
        this.tooltips.setTemplate(tooltipString);
      }

      const existingChart = this._chartArea.select("g.chart");
      if (!existingChart.empty()) {
        existingChart.remove();
      }
      chartG = this._chartArea.append("g").classed("chart", true);
      chartG.attr("transform", `translate(${width / 2},${height / 2})`);

      const WIDTH = width - this.MARGIN.LEFT - this.MARGIN.RIGHT;
      const HEIGHT = height - this.MARGIN.TOP - this.MARGIN.BOTTOM;

      const R = Math.min(WIDTH, HEIGHT) / 2;

      const arcGenerator: Arc<SVGPathElement, PieArcDatum<DataItem>> = arc<
        SVGPathElement,
        PieArcDatum<DataItem>
      >()
        .innerRadius(0)
        .outerRadius(R);

      const pieConvertor = pie<DataItem>().value((d) =>
        parseFloat(String(d[valueKey]))
      );

      const dataReady = pieConvertor(this._data);

      const chart = chartG.selectAll("path").data(dataReady);

      const pieGroups = chart
        .enter()
        .append("path")
        .classed("pie-slice", true)
        .attr("d", arcGenerator)
        .attr("data-tooltip", (d) => {
          if (this.tooltips) {
            return this.tooltips.compile(d.data);
          } else {
            return false;
          }
        })
        .attr("fill", (d) => d.data[COLOR_KEY]);

      pieGroups.on("mouseenter", function () {
        const node = select(this);
        pieGroups.classed("-fadeout", true);
        node.classed("-fadeout", false);
      });
      pieGroups.on("mouseleave", function () {
        pieGroups.classed("-fadeout", false);
      });

      // Set data-id attributes for pie slices to work with the selection plugin
      pieGroups.attr(METASTANZA_DATA_ATTR, (d) =>
        d.data[METASTANZA_NODE_ID_KEY]?.toString()
      );
    };

    await drawContent();

    const isLegendVisible: boolean = this.params["legend-visible"];

    const legendConfiguration = {
      items: this._data.map((item: string, index: number) => {
        return {
          id: "" + index,
          value: item[categoryKey],
          color: item[COLOR_KEY],
          toggled: false,
        };
      }),
      title: legendTitle,
      options: {
        fadeoutNodes: chartG?.selectAll(".pie-slice").nodes(),
        fadeProp: "opacity",
        showLeaders: false,
      },
    };

    if (isLegendVisible) {
      if (!this.legend) {
        this.legend = new Legend();
        this.root.append(this.legend);
      }
      this.legend.setup(legendConfiguration);
    } else {
      this.legend?.remove();
      this.legend = null;
    }

    if (this.tooltips) {
      this.tooltips.setup(root.querySelectorAll("[data-tooltip]"));
    }
  }

  handleEvent(event) {
    // Selection events are now handled by the NodeSelectionPlugin
  }
}
