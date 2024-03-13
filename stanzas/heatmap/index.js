import MetaStanza from "../../lib/MetaStanza";
import { select } from "d3";
import {
  emitSelectedEvent,
  updateSelectedElementClassNameForD3,
} from "@/lib/utils";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend2";
import { getGradationColor } from "@/lib/ColorGenerator";
import { Axis } from "@/lib/AxisMixin";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

export default class Heatmap extends MetaStanza {
  selectedEventParams = {
    targetElementSelector: ".rect",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "__togostanza_id__",
  };

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
    // Parameters
    const root = this._main;
    const dataset = this._data;
    this._chartArea = select(root.querySelector("svg"));
    const legendTitle = this.params["legend-title"];
    const legendShow = this.params["legend-visible"];
    const legendGroups = this.params["legend-levels_number"];
    const tooltipKey = this.params["tooltips-key"].trim();
    const tooltipHTML = (d) => d[tooltipKey];
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }
    if (this._apiError) {
      this.legend?.remove();
      this.legend = null;
      this.tooltip?.remove();
      this.tooltip = null;
    }

    // Styles
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;

    // Color scale
    const cellColorKey = this.params["cell-color_key"].trim();
    const cellColorMin = this.params["cell-color_min"];
    const cellColorMid = this.params["cell-color_mid"];
    const cellColorMax = this.params["cell-color_max"];
    let cellDomainMin = parseFloat(this.params["cell-value_min"]);
    let cellDomainMid = parseFloat(this.params["cell-value_mid"]);
    let cellDomainMax = parseFloat(this.params["cell-value_max"]);
    const values = dataset.map((d) => parseFloat(d[cellColorKey]));

    if (isNaN(parseFloat(cellDomainMin))) {
      cellDomainMin = Math.min(...values);
    }
    if (isNaN(parseFloat(cellDomainMax))) {
      cellDomainMax = Math.max(...values);
    }
    if (isNaN(parseFloat(cellDomainMid))) {
      cellDomainMid = (cellDomainMax + cellDomainMin) / 2;
    }

    const setColor = getGradationColor(
      this,
      [cellColorMin, cellColorMid, cellColorMax],
      [cellDomainMin, cellDomainMid, cellDomainMax]
    );

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
      tickLabelsAngle: this.params["axis-x-ticks_labels_angle"] || 0,
      title: this.params["axis-x-title"] || xKey,
      titlePadding: this.params["axis-x-title_padding"] || 0,
      scale: "ordinal",
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
      tickLabelsAngle: this.params["axis-y-ticks_labels_angle"] || 0,
      title: this.params["axis-y-title"] || yKey,
      titlePadding: this.params["axis-y-title_padding"] || 0,
      scale: "ordinal",
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

    if (!this._apiError) {
      const errorMessageEl = root.querySelector(
        ".metastanza-error-message-div"
      );
      if (errorMessageEl) {
        errorMessageEl.remove();
      }

      this._chartArea = select(root)
        .append("svg")
        .classed("svg", true)
        .attr("width", width)
        .attr("height", height);

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
        .attr("data-tooltip", (d) => tooltipHTML(d))
        .attr("width", this.xAxisGen.scale.bandwidth())
        .attr("height", this.yAxisGen.scale.bandwidth())
        .style("fill", (d) => setColor(d[cellColorKey]));

      if (this.params["event-outgoing_change_selected_nodes"]) {
        rectGroup.on("click", (e, d) => {
          select(e.target).raise();
          return emitSelectedEvent.apply(null, [
            {
              drawing: this._chartArea,
              rootElement: this.element,
              targetId: d.__togostanza_id__,
              ...this.selectedEventParams,
            },
          ]);
        });
      }

      this.xAxisGen._g.raise();
      this.yAxisGen._g.raise();

      this.tooltip.setup(root.querySelectorAll("[data-tooltip]"));

      if (legendShow) {
        if (!this.legend) {
          this.legend = new Legend();
          this.root.append(this.legend);
        }
        this.legend.setup({
          items: intervals(setColor).map((interval) => ({
            id: interval.label,
            color: interval.color,
            value: interval.label,
          })),
          title: legendTitle,
          options: {
            shape: "square",
          },
        });
      } else {
        this.legend?.remove();
        this.legend = null;
      }
    }

    //create legend objects
    function intervals(color, steps = legendGroups >= 2 ? legendGroups : 2) {
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

  handleEvent(event) {
    if (this.params["event-incoming_change_selected_nodes"]) {
      updateSelectedElementClassNameForD3.apply(null, [
        {
          drawing: this._chartArea,
          selectedIds: event.detail,
          ...this.selectedEventParams,
        },
      ]);
    }
  }
}
