import { select } from "d3";
import { ScaleLinear } from "d3-scale";
import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import { Axis } from "../../lib/AxisMixin";
import { getGradationColor } from "../../lib/ColorGenerator";
import Legend from "../../lib/Legend2.js";
import MetaStanza, {
  METASTANZA_DATA_ATTR,
  METASTANZA_NODE_ID_KEY,
} from "../../lib/MetaStanza";
import ToolTip from "../../lib/ToolTip";
import { SelectionPlugin } from "../../lib/plugins/SelectionPlugin";

interface DataItem {
  [key: string]: string | number;
}

interface Interval {
  label: number;
  color: string;
}

export default class Heatmap extends MetaStanza {
  _chartArea: d3.Selection<SVGGElement, unknown, SVGElement, undefined>;
  xAxisGen = null;
  yAxisGen = null;
  legend: Legend;
  tooltips: ToolTip;
  _selectionPlugin: SelectionPlugin;

  menu() {
    return [
      downloadSvgMenuItem(this, "heatmap"),
      downloadPngMenuItem(this, "heatmap"),
      downloadJSONMenuItem(this, "heatmap", this._data),
      downloadCSVMenuItem(this, "heatmap", this._data),
      downloadTSVMenuItem(this, "heatmap", this._data),
    ];
  }

  async renderNext() {
    this._selectionPlugin = new SelectionPlugin({
      adapter: "vanilla",
      stanza: this,
    });
    this.use(this._selectionPlugin);

    // Parameters
    const root = this._main;
    const dataset: DataItem[] = this._data;

    this._chartArea = select(root.querySelector("svg"));

    // Color scale
    const cellColorKey: string = this.params["cell-color_key"].trim();
    const cellColorMin: string = this.params["cell-color_min"];
    const cellColorMid: string = this.params["cell-color_mid"];
    const cellColorMax: string = this.params["cell-color_max"];
    let cellDomainMin = parseFloat(this.params["cell-value_min"]);
    let cellDomainMid = parseFloat(this.params["cell-value_mid"]);
    let cellDomainMax = parseFloat(this.params["cell-value_max"]);
    const values = dataset.map((d) => {
      const value = d[cellColorKey];
      return parseFloat(typeof value === "number" ? value.toString() : value);
    });

    if (isNaN(cellDomainMin)) {
      cellDomainMin = Math.min(...values);
    }
    if (isNaN(cellDomainMax)) {
      cellDomainMax = Math.max(...values);
    }
    if (isNaN(cellDomainMid)) {
      cellDomainMid = (cellDomainMax + cellDomainMin) / 2;
    }

    const setColor: ScaleLinear<string, number> = getGradationColor(
      this,
      [cellColorMin, cellColorMid, cellColorMax],
      [cellDomainMin, cellDomainMid, cellDomainMax]
    );

    // Legend
    const legendTitle = this.params["legend-title"];
    const isLegendVisible = this.params["legend-visible"];
    const legendGroups = this.params["legend-color_steps"];
    const legendConfiguration = {
      items: intervals(setColor).map((interval) => ({
        id: interval.label,
        color: interval.color,
        value: interval.label,
      })),
      title: legendTitle,
      options: {
        shape: "square",
      },
    };

    // Tooltip
    const tooltipString = this.params["tooltip"]?.trim();

    // Styles
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;

    // Axis
    const axisArea = {
      x: this.MARGIN.LEFT,
      y: this.MARGIN.TOP,
      width: width - this.MARGIN.LEFT - this.MARGIN.RIGHT,
      height: height - this.MARGIN.TOP - this.MARGIN.BOTTOM,
    };

    const xKey = this.params["axis-x-key"].trim();
    const xParams = {
      placement: this.params["axis-x-placement"],
      domain: [...new Set(dataset.map((d) => d[xKey]))],
      drawArea: axisArea,
      tickLabelsAngle: this.params["axis-x-ticks_label_angle"] || 0,
      title: this.params["axis-x-title"] || xKey,
      titlePadding: this.params["axis-x-title_padding"] || 0,
      scale: "ordinal",
      margins: {},
      gridInterval: 0,
      gridIntervalUnits: undefined,
      ticksInterval: undefined,
      ticksIntervalUnits: undefined,
      ticksLabelsFormat: undefined,
    };

    const yKey = this.params["axis-y-key"].trim();
    const yParams = {
      placement: this.params["axis-y-placement"],
      domain: [...new Set(dataset.map((d) => d[yKey]))],
      drawArea: axisArea,
      tickLabelsAngle: this.params["axis-y-ticks_label_angle"] || 0,
      title: this.params["axis-y-title"] || yKey,
      titlePadding: this.params["axis-y-title_padding"] || 0,
      scale: "ordinal",
      margins: {},
      gridInterval: 0,
      gridIntervalUnits: undefined,
      ticksInterval: undefined,
      ticksIntervalUnits: undefined,
      ticksLabelsFormat: undefined,
    };

    const AxesMargins = {
      LEFT: yParams.placement === "left" ? yParams.titlePadding || 0 : 0,
      RIGHT: yParams.placement === "right" ? yParams.titlePadding || 0 : 0,
      TOP: xParams.placement === "top" ? xParams.titlePadding || 0 : 0,
      BOTTOM: xParams.placement === "bottom" ? xParams.titlePadding || 0 : 0,
    };
    xParams.margins = AxesMargins;
    yParams.margins = AxesMargins;

    //Drawing area
    if (!this._chartArea.empty()) {
      this._chartArea.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }

    const drawContent = async () => {
      this._chartArea = select(root)
        .append("svg")
        .classed("svg", true)
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

      //Drawing axis
      if (!this.xAxisGen) {
        this.xAxisGen = new Axis(this._chartArea.node());
      }
      if (!this.yAxisGen) {
        this.yAxisGen = new Axis(this._chartArea.node());
      }
      this.xAxisGen.update(xParams);
      this.yAxisGen.update(yParams);
      this.xAxisGen.axisGen.tickSizeOuter(0);
      this.yAxisGen.axisGen.tickSizeOuter(0);

      const graphArea = this._chartArea
        .append("g")
        .classed("graph", true)
        .attr(
          "transform",
          `translate(${this.xAxisGen?.axisArea.x},${this.xAxisGen.axisArea.y})`
        );

      //Set for each rect
      const rectGroup = graphArea
        .append("g")
        .classed("g-rect", true)
        .selectAll()
        .data(dataset, (d) => `${d[xKey]}:${d[yKey]}`)
        .enter()
        .append("rect")
        .classed("rect", true)
        .attr("x", (d) => this.xAxisGen.scale(d[xKey]))
        .attr("y", (d) => this.yAxisGen.scale(d[yKey]))
        .attr("data-tooltip", (d) => {
          if (this.tooltips) {
            return this.tooltips.compile(d);
          } else {
            return false;
          }
        })
        .attr("width", this.xAxisGen.scale.bandwidth())
        .attr("height", this.yAxisGen.scale.bandwidth())
        .style("fill", (d) => {
          const value = d[cellColorKey];
          const numericValue =
            typeof value === "number" ? value : parseFloat(value);
          return setColor(numericValue);
        })
        .attr(METASTANZA_DATA_ATTR, (d) => d[METASTANZA_NODE_ID_KEY]);

      rectGroup.on("mouseenter", function () {
        const node = select(this);
        rectGroup.classed("-fadeout", true);
        node.classed("-fadeout", false);
      });
      rectGroup.on("mouseleave", function () {
        rectGroup.classed("-fadeout", false);
      });

      this.xAxisGen._g.raise();
      this.yAxisGen._g.raise();
    };

    await drawContent();

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

    // TODO: add color type. ScaleLinear<string, number>.
    // check https://github.com/d3/d3-scale/issues/111, https://github.com/DefinitelyTyped/DefinitelyTyped/issues/38574
    // fix ColorGenerator to typescript
    function intervals(
      color,
      steps: number = legendGroups >= 2 ? legendGroups : 2
    ): Interval[] {
      return [...Array(steps).keys()].map((i) => {
        const legendSteps = Math.round(
          cellDomainMax -
            i * (Math.abs(cellDomainMax - cellDomainMin) / (steps - 1))
        );
        return {
          label: legendSteps,
          color: color(legendSteps),
        };
      });
    }
  }
}
