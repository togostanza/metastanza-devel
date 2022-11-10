import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { getGradationColor } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Heatmap extends Stanza {
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

  async render() {
    const root = this.root.querySelector("main");

    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    const legendShow = this.params["legend"];
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }

    if (legendShow !== "none") {
      this.legend = new Legend();
      root.append(this.legend);
    }

    // Parameters
    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root
    );

    appendCustomCss(this, this.params["misc-custom_css_url"]);
    const cellColorKey = this.params["cell-color-key"];
    const xKey = this.params["axis-x-key"];
    const yKey = this.params["axis-y-key"];
    const xTitle = this.params["axis-x-title"] || xKey;
    const yTitle = this.params["axis-y-title"] || yKey;
    const xLabelAngle = this.params["x-ticks_labels_angle"];
    const yLabelAngle = this.params["y-ticks_labels_angle"];
    const axisTitlePadding = this.params["axis-title_padding"];
    const isAxisHide = this.params["axis-hide"];
    const legendTitle = this.params["legend-title"];
    const legendGroups = this.params["legend-groups"];
    const cellColorScale = this.params["cell-color-scale"];
    const tooltipKey = this.params["tooltips-key"];
    const tooltipHTML = (d) =>
      `<span><strong>${d[xKey]},${d[yKey]}: </strong>${d[tooltipKey]}</span>`;

    // Color scale
    const cellColorMin = this.params["cell-color-range_min"];
    const cellColorMid = this.params["cell-color-range_mid"];
    const cellColorMax = this.params["cell-color-range_max"];
    let cellDomainMin = parseFloat(this.params["cell-color-domain_min"]);
    let cellDomainMid = parseFloat(this.params["cell-color-domain_mid"]);
    let cellDomainMax = parseFloat(this.params["cell-color-domain_max"]);
    // const values = [...new Set(dataset.map((d) => d[cellColorKey]))];
    let values = [...new Set(dataset.map((d) => d[cellColorKey]))];
    const logScale = d3.scaleLog();
    switch (cellColorScale) {
      case "linear":
        values = [...new Set(dataset.map((d) => d[cellColorKey]))];
        break;
      case "log10":
        values = values.map((value) => logScale(value));
        break;
    }
    console.log(values);

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    if (isNaN(parseFloat(cellDomainMin))) {
      cellDomainMin = minValue;
    }
    if (isNaN(parseFloat(cellDomainMax))) {
      cellDomainMax = maxValue;
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
    const fontSize = +this.css("--togostanza-fonts-font_size_primary");
    const width = +this.css("--togostanza-outline-width");
    const height = +this.css("--togostanza-outline-height");
    const borderWidth = +this.css("--togostanza-border-width") || 0;
    const borderRadius = +this.css("--togostanza-border-radius");
    const tickSize = 2;

    // x-axis scale
    const rows = [...new Set(dataset.map((d) => d[xKey]))];
    const x = d3.scaleBand().domain(rows).range([0, width]);
    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    // y-axis scale
    const columns = [...new Set(dataset.map((d) => d[yKey]))];
    const y = d3.scaleBand().domain(columns).range([height, 0]);
    const yAxisGenerator = d3
      .axisLeft(y)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    d3.select(root).select("svg").remove();
    //Drawing area
    const svg = d3.select(root).append("svg");

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
    const margin = axisTitlePadding + maxColumnWidth + tickSize;

    //Graph area including title
    svg
      .attr("width", width + margin + fontSize)
      .attr("height", height + margin + fontSize);

    const graphArea = svg
      .append("g")
      .attr("class", "graph")
      .attr("transform", `translate(${margin + fontSize}, 0)`);

    //Set for each rect
    graphArea
      .append("g")
      .attr("class", "rect")
      .selectAll()
      .data(dataset, (d) => `${d[xKey]}:${d[yKey]}`)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[xKey]))
      .attr("y", (d) => y(d[yKey]))
      .attr("data-tooltip-html", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", borderRadius)
      .attr("ry", borderRadius)
      .style("fill", (d) => setColor(d[cellColorKey]))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    //Draw the x-axis
    const xaxisArea = graphArea
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);
    xaxisArea
      .append("g")
      .call(xAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${xLabelAngle})`);
    //Draw the x-axis title
    xaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${margin})`)
      .text(xTitle);

    //Draw the y-axis;
    const yaxisArea = graphArea.append("g").attr("class", "y-axis");
    yaxisArea
      .append("g")
      .call(yAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);
    //Draw the y-axis title
    yaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-${margin}, ${height / 2}) rotate(-90)`)
      .text(yTitle);

    //Hide axis lines and ticks
    if (!isAxisHide) {
      svg.select(".x-axis path").remove();
      svg.select(".y-axis path").remove();
      svg.selectAll(".x-axis .tick line").remove();
      svg.selectAll(".y-axis .tick line").remove();
    }

    //Give text class to all text
    graphArea.selectAll("text").attr("class", "text");

    this.tooltip.setup(root.querySelectorAll("[data-tooltip]"));

    if (legendShow !== "none") {
      this.legend.setup(
        intervals(setColor),
        {},
        {
          position: legendShow.split("-"),
        },
        legendTitle
      );
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

    // create legend objects
    function intervals(color, steps = legendGroups >= 2 ? legendGroups : 2) {
      return [...Array(steps).keys()].map((i) => {
        const legendSteps = Math.round(
          maxValue - i * (Math.abs(maxValue - minValue) / (steps - 1))
        );
        return {
          label: legendSteps,
          color: color(legendSteps),
        };
      });
    }
  }
}
