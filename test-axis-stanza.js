import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, s as select, g as defineStanzaElement } from './index-ec45d824.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { p as paramsModel, A as Axis } from './AxisMixin-05cdb891.js';
import { g as getMarginsFromCSSString } from './utils-95f80352.js';
import './time-06df3bf5.js';
import './linear-1b2cc043.js';
import './log-b4392039.js';
import './band-98510399.js';
import './range-e15c6861.js';
import './axis-3dba94d9.js';

class TestAxis extends Stanza {
    _data;
    xAxisGen;
    interval;
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
        if (this.interval) {
            clearInterval(this.interval);
        }
        const MARGIN = getMarginsFromCSSString(css("--togostanza-canvas-padding"));
        const width = +css("--togostanza-canvas-width");
        const height = +css("--togostanza-canvas-height");
        this._data = await loadData(this.params["data-url"], this.params["data-type"], this.root.querySelector("main"));
        let params;
        try {
            params = paramsModel.parse(this.params);
        }
        catch (error) {
            console.log(error);
            return;
        }
        const root = this.root.querySelector("main");
        let svg = select(root.querySelector("svg"));
        if (svg.empty()) {
            svg = select(root).append("svg");
        }
        svg.attr("width", width).attr("height", height);
        const axisArea = { x: 100, y: 120, width: 200, height: 130 };
        const xParams = {
            placement: params["axis-x-placement"],
            domain: [-10, 100],
            drawArea: axisArea,
            margins: MARGIN,
            tickLabelsAngle: params["axis-x-ticks_label_angle"],
            title: params["axis-x-title"],
            titlePadding: params["axis-x-title_padding"],
            scale: params["axis-x-scale"],
            gridInterval: params["axis-x-gridlines_interval"],
            gridIntervalUnits: params["axis-x-gridlines_interval_units"],
            ticksInterval: params["axis-x-ticks_interval"],
            ticksIntervalUnits: params["axis-x-ticks_interval_units"],
            ticksLabelsFormat: params["axis-x-ticks_labels_format"],
        };
        const yParams = {
            placement: params["axis-y-placement"],
            domain: [0.01, 3],
            drawArea: axisArea,
            margins: MARGIN,
            tickLabelsAngle: params["axis-y-ticks_label_angle"],
            title: params["axis-y-title"],
            titlePadding: params["axis-y-title_padding"],
            scale: params["axis-y-scale"],
            gridInterval: params["axis-y-gridlines_interval"],
            gridIntervalUnits: params["axis-x-gridlines_interval_units"],
            ticksInterval: params["axis-y-ticks_interval"],
            ticksIntervalUnits: params["axis-y-ticks_interval_units"],
            ticksLabelsFormat: params["axis-y-ticks_labels_format"],
        };
        if (!this.xAxisGen) {
            this.xAxisGen = new Axis(svg.node());
        }
        if (!this.yAxisGen) {
            this.yAxisGen = new Axis(svg.node());
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.xAxisGen.update(xParams);
        this.yAxisGen.update(yParams);
        // this.interval = setInterval(() => {
        //   let domain = [];
        //   switch (xParams.scale) {
        //     case "ordinal":
        //       domain = getRandomDomain(Math.floor(Math.random() * 15));
        //       break;
        //     case "time":
        //       domain = [
        //         new Date(
        //           2000,
        //           Math.floor(Math.random() * 11),
        //           Math.floor(Math.random() * 30)
        //         ),
        //         new Date(
        //           2000,
        //           Math.floor(Math.random() * 11),
        //           Math.floor(Math.random() * 30)
        //         ),
        //       ];
        //       domain.sort((a, b) => a - b);
        //       break;
        //     case "linear":
        //       let sign1 = 1;
        //       let sign2 = 1;
        //       if (Math.random() > 0.5) {
        //         sign1 = -1;
        //       }
        //       if (Math.random() > 0.5) {
        //         sign1 = -1;
        //       }
        //       domain = [
        //         sign1 * Math.random() * 10,
        //         sign2 * Math.random() * 10,
        //       ].sort((a, b) => a - b);
        //       break;
        //     case "log10":
        //       domain = [0.01, Math.random() * 10000];
        //       break;
        //     default:
        //       break;
        //   }
        //   this.xAxisGen.update({
        //     domain,
        //   });
        //   this.yAxisGen.update({ domain: [0.01, Math.random() * 100] });
        // }, 1000);
    }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': TestAxis
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "test-axis-stanza",
	"stanza:label": "Test axis",
	"stanza:definition": "Test axis MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-01-06",
	"stanza:updated": "2022-11-01",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:type": "text",
		"stanza:example_csv": "https://raw.githubusercontent.com/jbrownlee/Datasets/master/daily-min-temperatures.csv",
		"stanza:example_sparql": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/linechart-data-with-errors.json",
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
		"stanza:key": "misc-custom_css_url",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:default": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
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
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"test-axis\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=test-axis-stanza.js.map
