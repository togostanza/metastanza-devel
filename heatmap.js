import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, s as select, g as defineStanzaElement } from './index-b37241ec.js';
import { l as loadData } from './load-data-0ddebadb.js';
import { T as ToolTip } from './ToolTip-8932448c.js';
import { L as Legend } from './Legend-949ef6e4.js';
import { a as getGradationColor } from './ColorGenerator-8b50b614.js';
import { b as band } from './band-d0e670ee.js';
import { a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import './ref-3a8fb5e8.js';
import './linear-13370298.js';
import './range-e15c6861.js';

class Heatmap extends Stanza {
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

    const legendShow = this.params["legend-show"];
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }

    if (legendShow === true) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    // Parameters
    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root
    );

    this._data = dataset;

    appendCustomCss(this, this.params["custom_css_url"]);
    const cellColorKey = this.params["cell-color-key"];
    const xKey = this.params["axis-x-key"];
    const yKey = this.params["axis-y-key"];
    const xTitle = this.params["axis-x-title"] || xKey;
    const yTitle = this.params["axis-y-title"] || yKey;
    const xLabelAngle = this.params["axis-x-ticks_labels_angle"] || 0;
    const yLabelAngle = this.params["axis-y-ticks_labels_angle"] || 0;
    const axisXTitlePadding = this.params["axis-x-title_padding"] || 0;
    const axisYTitlePadding = this.params["axis-y-title_padding"] || 0;
    const isAxisHide = this.params["axis-hide"];
    const legendTitle = this.params["legend-title"];
    const legendGroups = this.params["legend-groups"];
    const tooltipKey = this.params["tooltips-key"];
    const tooltipHTML = (d) => d[tooltipKey];

    // Color scale
    const cellColorMin = this.params["cell-color-min"];
    const cellColorMid = this.params["cell-color-mid"];
    const cellColorMax = this.params["cell-color-max"];
    let cellDomainMin = parseFloat(this.params["cell-value-min"]);
    let cellDomainMid = parseFloat(this.params["cell-value-mid"]);
    let cellDomainMax = parseFloat(this.params["cell-value-max"]);
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
    const width = parseFloat(this.css("--togostanza-canvas-width"));
    const height = parseFloat(this.css("--togostanza-canvas-height"));
    const borderWidth = parseFloat(this.css("--togostanza-border-width") || 0);
    const tickSize = 2;

    // x-axis scale
    const rows = [...new Set(dataset.map((d) => d[xKey]))];
    const x = band().domain(rows).range([0, width]);
    const xAxisGenerator = axisBottom(x)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    // y-axis scale
    const columns = [...new Set(dataset.map((d) => d[yKey]))];
    const y = band().domain(columns).range([height, 0]);
    const yAxisGenerator = axisLeft(y)
      .tickSizeInner(tickSize)
      .tickSizeOuter(0);

    select(root).select("svg").remove();
    //Drawing area
    const svg = select(root).append("svg");

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
      left: axisXTitlePadding + maxColumnWidth + tickSize,
      bottom: axisYTitlePadding + maxColumnWidth + tickSize,
    };

    //Graph area including title
    svg
      .attr("width", width + margin.left + fontSize)
      .attr("height", height + margin.bottom + fontSize);

    const graphArea = svg
      .append("g")
      .attr("class", "graph")
      .attr("transform", `translate(${margin.left + fontSize}, 0)`);

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
      .style("fill", (d) => setColor(d[cellColorKey]))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    //Draw about the x-axis
    const xaxisArea = graphArea
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);
    xaxisArea
      .append("g")
      .attr("class", "x-axis-label")
      .call(xAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${xLabelAngle})`);
    xaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${margin.bottom})`)
      .text(xTitle);

    //Draw about the y-axis;
    const yaxisArea = graphArea.append("g").attr("class", "y-axis");
    yaxisArea
      .append("g")
      .attr("class", "y-axis-label")
      .call(yAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);
    yaxisArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(-${margin.left}, ${height / 2}) rotate(-90)`
      )
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

    if (legendShow === true) {
      this.legend.setup(
        intervals(setColor),
        null,
        {
          position: ["top", "right"],
        },
        legendTitle
      );
    }

    //Function of mouseover and mouse leave
    function mouseover() {
      select(this).classed("highlighted", true).raise();
      if (!borderWidth) {
        select(this)
          .classed("highlighted", true)
          .style("stroke-width", "1px")
          .raise();
      }
    }
    function mouseleave() {
      select(this).classed("highlighted", false);
      if (!borderWidth) {
        select(this)
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Heatmap
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "heatmap",
	"stanza:label": "Heatmap",
	"stanza:definition": "Heatmap MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-08-26",
	"stanza:updated": "2022-07-01",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/heatmap-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "legend-show",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Whether show the legend"
	},
	{
		"stanza:key": "legend-title",
		"stanza:type": "text",
		"stanza:example": "value",
		"stanza:description": "Legend title"
	},
	{
		"stanza:key": "legend-groups",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Number of gradation colors between color-min and color-max"
	},
	{
		"stanza:key": "axis-hide",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show axis lines and ticks"
	},
	{
		"stanza:key": "axis-x-key",
		"stanza:type": "text",
		"stanza:example": "group",
		"stanza:description": "What X key in data to use",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-x-title",
		"stanza:type": "text",
		"stanza:description": "X axis title"
	},
	{
		"stanza:key": "axis-x-title_padding",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Title and X axis gap in px"
	},
	{
		"stanza:key": "axis-x-ticks_labels_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "X ticks labels angle (in degree)"
	},
	{
		"stanza:key": "axis-y-key",
		"stanza:type": "text",
		"stanza:example": "variable",
		"stanza:description": "What Y key in data to use",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-y-title",
		"stanza:type": "text",
		"stanza:description": "Y axis title"
	},
	{
		"stanza:key": "axis-y-title_padding",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Title and Y axis gap in px"
	},
	{
		"stanza:key": "axis-y-ticks_labels_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y ticks labels angle (in degree)"
	},
	{
		"stanza:key": "cell-color-key",
		"stanza:type": "text",
		"stanza:example": "value",
		"stanza:description": "Data key to color the data points. if all data keys values includes hex color, use that color, otherwise use ordinal scale from the theme colors."
	},
	{
		"stanza:key": "cell-color-min",
		"stanza:type": "text",
		"stanza:example": "#6590e6",
		"stanza:description": "Cell color range min"
	},
	{
		"stanza:key": "cell-color-mid",
		"stanza:type": "text",
		"stanza:example": "#ffffff",
		"stanza:description": "Cell color range mid"
	},
	{
		"stanza:key": "cell-color-max",
		"stanza:type": "text",
		"stanza:example": "#F75976",
		"stanza:description": "Cell color range max"
	},
	{
		"stanza:key": "cell-value-min",
		"stanza:type": "number",
		"stanza:example": -50,
		"stanza:description": "Cell color domain min"
	},
	{
		"stanza:key": "cell-value-mid",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Cell color domain mid"
	},
	{
		"stanza:key": "cell-value-max",
		"stanza:type": "number",
		"stanza:example": 100,
		"stanza:description": "Cell color domain max"
	},
	{
		"stanza:key": "tooltips-key",
		"stanza:type": "text",
		"stanza:example": "value",
		"stanza:description": "Data key to use as tooltip"
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:description": "custom css to apply"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-canvas-width",
		"stanza:type": "number",
		"stanza:default": 450,
		"stanza:description": "Canvas width"
	},
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 450,
		"stanza:description": "Canvas height"
	},
	{
		"stanza:key": "--togostanza-canvas-padding",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "Padding of a stanza. CSS padding-like text (10px 10px 10px 10px)"
	},
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Depth color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Depth color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Depth color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Depth color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Depth color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Depth color 5"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Font size primary"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Secondary (axes ticks, legend, tooltips) font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Border color for everything that have a border"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-cell-border_hover_color",
		"stanza:type": "color",
		"stanza:default": "#FFDF3D",
		"stanza:description": "Hover border color"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=heatmap.js.map
