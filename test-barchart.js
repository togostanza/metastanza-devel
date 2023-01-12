import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, s as select, g as defineStanzaElement } from './index-ec45d824.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { p as paramsModel, A as Axis } from './AxisMixin-05cdb891.js';
import { g as getMarginsFromCSSString } from './utils-95f80352.js';
import { S as StanzaColorGenerator } from './ColorGenerator-3e801856.js';
import { s as stack, g as group } from './stack-3fa93593.js';
import { o as ordinal } from './linear-1b2cc043.js';
import { m as max } from './max-2c042256.js';
import './time-06df3bf5.js';
import './log-b4392039.js';
import './band-98510399.js';
import './range-e15c6861.js';
import './axis-3dba94d9.js';
import './array-80a7907a.js';
import './constant-c49047a5.js';

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
    this.params["error_bars-key"];

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

    let svg = select(root.querySelector("svg"));

    if (!svg.empty()) {
      svg.remove();
      this.xAxisGen = null;
      this.yAxisGen = null;
    }
    svg = select(root).append("svg");
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
    const color = ordinal()
      .domain(gSubKeyNames)
      .range(togostanzaColors);

    const stack$1 = stack().keys(gSubKeyNames);
    const dataset = [];
    for (const entry of group(values, (d) => d[xKeyName]).entries()) {
      dataset.push({
        x: entry[0],
        ...Object.fromEntries(
          entry[1].map((d) => [d[groupKeyName], d[yKeyName]])
        ),
      });
    }
    const stackedData = stack$1(dataset);
    const dataMax = max(stackedData.flat(), (d) => d[1]);
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': TestBarchart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "test-barchart",
	"stanza:label": "Test barchart",
	"stanza:definition": "Test barchart using Axis mixin",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2023-01-12",
	"stanza:updated": "2022-01-12",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:type": "text",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
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
		"stanza:key": "togostanza-custom_css_url",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "grouping-key",
		"stanza:type": "text",
		"stanza:example": "category",
		"stanza:description": "Group bars by this key",
		"stanza:required": false
	},
	{
		"stanza:key": "error_bars-key",
		"stanza:type": "string",
		"stanza:example": "error",
		"stanza:description": "Show error bars. Data for error bars is array [minValue, maxValue]. If the key is not existing in data, no error bars would be shown",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-key",
		"stanza:type": "text",
		"stanza:example": "chromosome",
		"stanza:description": "X axis data key",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-x-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top",
			"bottom"
		],
		"stanza:example": "bottom",
		"stanza:description": "axis placement",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-x-title",
		"stanza:type": "text",
		"stanza:example": "Category",
		"stanza:computed": true,
		"stanza:description": "Axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-title_padding",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:default": 20,
		"stanza:description": "Axis title padding in px",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_label_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:default": 0,
		"stanza:description": "Tick labels angle, in degrees",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log10",
			"ordinal",
			"time"
		],
		"stanza:example": "linear",
		"stanza:description": "Axis scale",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_interval",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis ticks interval. If not set, in case of `continuous` scales, show 5 ticks at automatically chosen `neat` values, in case of `ordinal` scale, show ticks at all domain values. If set to 0, hide all ticks. In case of `ordinal` scale, setting this parameter will show only n-th ticks of the domain (i.e.: domain = ['a', 'b', 'c', 'd', 'e'], ticks_interval set to 2 will show ticks at 'a', 'c' and 'e')",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"year",
			"month",
			"week",
			"day",
			"hour",
			"minute",
			"second"
		],
		"stanza:example": "none",
		"stanza:default": "none",
		"stanza:description": "Axis ticks interval units. (Effective only for time scale)",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-ticks_labels_format",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:description": "Axis ticks format, in d3.format or d3.timeFormat string form (time scale). In case of time scale, use d3.timeFormat format string (https://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html), fallback value for time scale is '%b %d %I %p'. Have no effect in case of ordinal scale)",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-gridlines_interval",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis gridlines interval. If not set, show 5 gridlines at `neat` values, if set to 0, not show gridlines.",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-x-gridlines_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"year",
			"month",
			"week",
			"day",
			"hour",
			"minute",
			"second"
		],
		"stanza:example": "none",
		"stanza:default": "none",
		"stanza:description": "Axis grid lines interval units. (Effective only for time scale)",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-key",
		"stanza:type": "text",
		"stanza:example": "count",
		"stanza:description": "Y axis data key",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-y-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"right"
		],
		"stanza:example": "left",
		"stanza:description": "Y axis placement",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-y-title",
		"stanza:type": "text",
		"stanza:example": "Data",
		"stanza:computed": true,
		"stanza:description": "Axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-title_padding",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:default": 20,
		"stanza:description": "Axis title padding in px",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_label_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:default": 0,
		"stanza:description": "X axis ticks angle",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log10",
			"ordinal",
			"time"
		],
		"stanza:example": "linear",
		"stanza:default": "linear",
		"stanza:description": "Axis scale",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_interval",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis ticks interval. If not set, in case of `continuous` scales, show 5 ticks at automatically chosen `neat` values, in case of `ordinal` scale, show ticks at all domain values. If set to 0, hide all ticks. In case of `ordinal` scale, setting this parameter will show only n-th ticks of the domain (i.e.: domain = ['a', 'b', 'c', 'd', 'e'], ticks_interval set to 2 will show ticks at 'a', 'c' and 'e')",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-ticks_labels_format",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Axis ticks interval format, in d3.format string form",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-gridlines_interval",
		"stanza:type": "number",
		"stanza:example": null,
		"stanza:computed": true,
		"stanza:description": "Axis gridlines interval. If not set, show 5 gridlines at `neat` values, if set to 0, not show gridlines.",
		"stanza:required": false
	},
	{
		"stanza:key": "axis-y-gridlines_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"year",
			"month",
			"week",
			"day",
			"hour",
			"minute",
			"second"
		],
		"stanza:example": "none",
		"stanza:default": "none",
		"stanza:description": "Axis grid lines interval units. (Effective only for time scale)",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Primary font size"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Secondary font size"
	},
	{
		"stanza:key": "--togostanza-canvas-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Togostanza element width"
	},
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Togostanza element height"
	},
	{
		"stanza:key": "--togostanza-canvas-padding",
		"stanza:type": "text",
		"stanza:default": "30px",
		"stanza:description": "Togostanza element inner padding"
	},
	{
		"stanza:key": "--togostanza-axis-zero_line_color",
		"stanza:type": "color",
		"stanza:default": "#FF0000",
		"stanza:description": "Axis zero gridline color"
	},
	{
		"stanza:key": "--togostanza-axis-zero_line_width",
		"stanza:type": "number",
		"stanza:default": 2,
		"stanza:description": "Axis zero gridline width in px"
	},
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	}
]
};

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=test-barchart.js.map
