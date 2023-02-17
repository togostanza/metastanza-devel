import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend2";
import { getMarginsFromCSSString } from "../../lib/utils";
import { getGradationColor } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import { Axis, AxisScaleE, paramsModel } from "../../lib/AxisMixin";
import MetaStanza from "../../lib/MetaStanza";

export default class Heatmap extends MetaStanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "heatmap"),
      downloadPngMenuItem(this, "heatmap"),
      downloadJSONMenuItem(this, "heatmap", this._data),
      downloadCSVMenuItem(this, "heatmap", this._data),
      downloadTSVMenuItem(this, "heatmap", this._data),
    ];
  }

  css(key) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }

  async renderNext() {
    const root = this.root.querySelector("main");

    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    const legendShow = this.params["legend-visible"];

    // Parameters
    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root
    );
    this._data = dataset;

    appendCustomCss(this, this.params["togostanza-custom_css_url"]);
    const cellColorKey = this.params["cell-color_key"].trim();
    const xKey = this.params["axis-x-key"].trim();
    const yKey = this.params["axis-y-key"].trim();
    const xTitle = this.params["axis-x-title"] || xKey;
    const yTitle = this.params["axis-y-title"] || yKey;
    const xLabelAngle = this.params["axis-x-ticks_labels_angle"] || 0;
    const yLabelAngle = this.params["axis-y-ticks_labels_angle"] || 0;
    const axisXTitlePadding = this.params["axis-x-title_padding"] || 0;
    const axisYTitlePadding = this.params["axis-y-title_padding"] || 0;
    const legendTitle = this.params["legend-title"];
    const legendGroups = this.params["legend-levels_number"];
    const tooltipKey = this.params["tooltips-key"].trim();
    const tooltipHTML = (d) => d[tooltipKey];

    // Color scale
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

    //Styles
    const fontSize = parseFloat(
      this.css("--togostanza-fonts-font_size_primary")
    );
    const width = parseFloat(this.css("--togostanza-canvas-width")) || 0;
    const height = parseFloat(this.css("--togostanza-canvas-height")) || 0;
    const padding = getMarginsFromCSSString(
      this.css("--togostanza-canvas-padding")
    );
    // const svgWidth = width - padding.LEFT - padding.RIGHT;
    // const svgHeight = height - padding.TOP - padding.BOTTOM;
    const svgWidth = width - padding.LEFT - padding.RIGHT;
    const svgHeight = height - padding.TOP - padding.BOTTOM;

    const borderWidth =
      parseFloat(this.css("--togostanza-border-width")) > 0
        ? parseFloat(this.css("--togostanza-border-width"))
        : 0;
    const tickSize = 2;

    const rows = [...new Set(dataset.map((d) => d[xKey]))];
    const columns = [...new Set(dataset.map((d) => d[yKey]))];

    let params;
    try {
      params = paramsModel.parse(this.params);
    } catch (error) {
      console.log(error);
      return;
    }
    console.log(this.MARGIN);

    const axisArea = { x: 0, y: 0, width, height };
    const xParams = {
      placement: params["axis-x-placement"],
      // domain: xDomain,
      domain: rows,
      drawArea: axisArea,
      margins: this.MARGIN,
      tickLabelsAngle: params["axis-x-ticks_label_angle"],
      title: xTitle,
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
      // domain: yDomain,
      domain: columns,
      drawArea: axisArea,
      margins: this.MARGIN,
      tickLabelsAngle: params["axis-y-ticks_label_angle"],
      title: yTitle,
      titlePadding: params["axis-y-title_padding"],
      scale: "ordinal",
      gridInterval: params["axis-y-gridlines_interval"],
      gridIntervalUnits: params["axis-x-gridlines_interval_units"],
      ticksInterval: params["axis-y-ticks_interval"],
      ticksIntervalUnits: params["axis-y-ticks_interval_units"],
      ticksLabelsFormat: params["axis-y-ticks_labels_format"],
    };

    // d3.select(root).select("svg").remove();
    let svg = d3.select(this._main.querySelector("svg"));
    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    //Drawing area
    svg = d3
      .select(root)
      .append("svg")
      .classed("svg", true)
      // .attr("width", svgWidth + borderWidth / 2)
      // .attr("height", svgHeight + borderWidth / 2);
      .attr("width", width)
      .attr("height", height);

    if (!this.xAxisGen) {
      this.xAxisGen = new Axis(svg.node());
    }
    if (!this.yAxisGen) {
      this.yAxisGen = new Axis(svg.node());
    }
    this.xAxisGen.update(xParams);
    this.yAxisGen.update(yParams);

    this.xAxisGen.axisGen.tickSizeOuter(0);
    this.yAxisGen.axisGen.tickSizeOuter(0);

    //Get width of the largest column label
    const maxColumnGroup = svg.append("g");
    maxColumnGroup
      .selectAll("text")
      .data(columns)
      .enter()
      .append("text")
      .text((d) => d);
    const maxColumnWidth = maxColumnGroup.node().getBBox().width;
    maxColumnGroup.remove();

    //Margin between graph and title
    const margin = {
      left: axisYTitlePadding + maxColumnWidth + tickSize,
      bottom: axisXTitlePadding + maxColumnWidth + tickSize,
    };

    // x-axis scale
    const x = d3
      .scaleBand()
      .domain(rows)
      .range([0, svgWidth - margin.left - fontSize]);
    x.paddingOuter(borderWidth / 2 / x.step());
    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    // y-axis scale
    const y = d3
      .scaleBand()
      .domain(columns)
      .range([svgHeight - margin.bottom - fontSize, 0]);
    y.paddingOuter(borderWidth / 2 / y.step());
    const yAxisGenerator = d3
      .axisLeft(y)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    const graphArea = svg
      .append("g")
      .classed("graph", true)
      .attr(
        "transform",
        `translate(${margin.left + fontSize},  ${borderWidth / 2})`
      );

    //Set for each rect
    graphArea
      .append("g")
      .classed("g-rect", true)
      .selectAll()
      .data(dataset, (d) => `${d[xKey]}:${d[yKey]}`)
      .enter()
      .append("rect")
      .classed("rect", true)
      // .attr("x", (d) => x(d[xKey]))
      .attr("x", (d) => this.xAxisGen.scale(d[xKey]))
      // .attr("y", (d) => y(d[yKey]))
      .attr("y", (d) => this.yAxisGen.scale(d[yKey]))
      .attr("data-tooltip", (d) => tooltipHTML(d))
      // .attr("width", x.bandwidth())
      .attr("width", this.xAxisGen.scale.bandwidth())
      // .attr("height", y.bandwidth())
      .attr("height", this.yAxisGen.scale.bandwidth())
      .style("fill", (d) => setColor(d[cellColorKey]))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    //Draw about the x-axis
    const xaxisArea = graphArea
      .append("g")
      .classed("x-axis", true)
      .attr(
        "transform",
        `translate(0, ${svgHeight - margin.bottom - fontSize})`
      );
    xaxisArea
      .append("g")
      .classed("x-axis-label", true)
      .call(xAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${xLabelAngle})`);
    xaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${(svgWidth - margin.left - fontSize) / 2}, ${
          margin.bottom
        })`
      )
      .text(xTitle);

    //Draw about the y-axis;
    const yaxisArea = graphArea.append("g").classed("y-axis", true);
    yaxisArea
      .append("g")
      .classed("y-axis-label", true)
      .call(yAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);
    yaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(-${margin.left}, ${
          (svgHeight - margin.bottom - fontSize) / 2
        }) rotate(-90)`
      )
      .text(yTitle);

    //Give text class to all text
    graphArea.selectAll("text").classed("text", true);

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

    //Function of mouseover and mouse leave
    function mouseover() {
      d3.select(this).classed("highlighted", true).raise();
      if (!borderWidth) {
        d3.select(this)
          .classed("highlighted", true)
          .style("stroke-width", "1px")
          .raise();
      }
    }
    function mouseleave() {
      d3.select(this).classed("highlighted", false);
      if (!borderWidth) {
        d3.select(this)
          .classed("highlighted", false)
          .style("stroke-width", "0px");
        graphArea.selectAll(".x-axis").raise();
        graphArea.selectAll(".y-axis").raise();
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
}
