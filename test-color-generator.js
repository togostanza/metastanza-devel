import { S as Stanza, d as defineStanzaElement } from './transform-53933414.js';
import { d as d3 } from './index-6868dabb.js';
import { S as StanzaColorGenerator, I as InterpolateColorGenerator, C as CirculateColorGenerator } from './ColorGenerator-eaa87470.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-9bc9e50c.js';
import './brush-f9fbbf81.js';
import './ordinal-90a3df9a.js';
import './nodrag-dddb5891.js';
import './step-b3038df7.js';
import './manyBody-e34c7fbb.js';
import './range-e15c6861.js';
import './stratify-7050dfd9.js';
import './index-c76c1b89.js';
import './dice-7bdb0652.js';
import './linear-546377fb.js';
import './max-2c042256.js';
import './tree-0236e2eb.js';
import './symbol-6a0b2d8d.js';
import './log-17aebfea.js';
import './constant-c49047a5.js';
import './math-24162d65.js';
import './path-a78af922.js';
import './pow-e5124b28.js';
import './array-80a7907a.js';
import './line-5ff356a1.js';
import './point-7945b9d0.js';
import './basis-0dde91c7.js';
import './stack-a283014a.js';
import './extent-14a1e8e9.js';
import './dsv-ac31b097.js';
import './sum-44e7480e.js';
import './axis-3dba94d9.js';
import './ribbon-bbaf0468.js';
import './drag-4fd06c1d.js';
import './partition-e955ad6c.js';
import './band-407353db.js';
import './create-5ec6ea56.js';
import './arc-8a3c109f.js';
import './link-3796f00e.js';

const CIRCULATE = "circulate";
const INTERPOLATE = "interpolate";

class TestColorGenerator extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "TestColorGenerator"),
      downloadPngMenuItem(this, "TestColorGenerator"),
      downloadJSONMenuItem(this, "TestColorGenerator", this.data),
      downloadCSVMenuItem(this, "TestColorGenerator", this.data),
      downloadTSVMenuItem(this, "TestColorGenerator", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    this.renderTemplate({ template: "stanza.html.hbs" });

    const colorChips = this.root.querySelector("#color-chips");

    // get parameters
    const numOfGradation = this.params["number-of-gradation"];
    const colorCirculation = this.params["type-of-color-circulation"];
    const colorDomain = this.params["color-domain"]
      ? this.params["color-domain"].split(",").map((pos) => +pos)
      : "";
    const colorRange = this.params["color-range"].split(",");
    const numOfMakeColor = this.params["number-of-make-color"];
    let d3ColorScheme = this.params["color-scheme"];
    let colors = [],
      colorGenerator;

    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }

    const USER_SPECIFIED =
      colorDomain.length !== 1 &&
      colorRange.length !== 1 &&
      colorDomain.length === colorRange.length;
    const RANGE_HAS_CHARACTER = colorRange[0].length;
    const SCHEME_IS_CATEGORICAL = d3ColorScheme.indexOf("Categorical-") !== -1;
    const SCHEME_IS_CONTINUOUS = d3ColorScheme.indexOf("Continuous-") !== -1;
    const CUSTOM = d3ColorScheme === "Custom";
    const stanzaColors = new StanzaColorGenerator(this).stanzaColor;

    const circulateColorGenerate = (prefix, pattern) => {
      d3ColorScheme = d3ColorScheme.replace(`${prefix}-`, "");
      colors = getColorsWithD3PresetColor(
        `${pattern}${d3ColorScheme}`,
        numOfGradation
      );
      colorGenerator = new CirculateColorGenerator(colors);
    };

    //Switching color patterns based on params "color-scheme" "number-of-gradation"
    function getColorsWithD3PresetColor(d3PresetColor, numberOfGradation) {
      switch (true) {
        case d3PresetColor.startsWith("scheme"):
          return [...d3[d3PresetColor]];
        case d3PresetColor.startsWith("interpolate"): {
          return [...Array(numberOfGradation)].map((_, index) =>
            d3[d3PresetColor](index / (numberOfGradation - 1))
          );
        }
      }
    }

    //Switch between when colorCirculation is "circulate" and when it is "interpolate"
    switch (colorCirculation) {
      case CIRCULATE:
        switch (true) {
          case USER_SPECIFIED:
            colorGenerator = new CirculateColorGenerator(
              colorRange,
              colorDomain,
              numOfMakeColor
            );
            break;

          case RANGE_HAS_CHARACTER:
            colorGenerator = new CirculateColorGenerator(colorRange);
            break;

          case SCHEME_IS_CATEGORICAL:
            circulateColorGenerate("Categorical", "scheme");
            if (CUSTOM) {
              colors = stanzaColors;
              colorGenerator = new CirculateColorGenerator(colors);
            }
            break;

          case SCHEME_IS_CONTINUOUS:
            circulateColorGenerate("Continuous", "interpolate");
        }
        break;

      case INTERPOLATE:
        switch (true) {
          case USER_SPECIFIED:
            colorGenerator = new InterpolateColorGenerator(
              colorRange,
              colorDomain
            );
            break;

          case SCHEME_IS_CATEGORICAL:
            d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
            if (CUSTOM) {
              colors = stanzaColors;
              colorGenerator = new InterpolateColorGenerator(colors);
            } else {
              colors = getColorsWithD3PresetColor(
                `scheme${d3ColorScheme}`,
                numOfGradation
              );
              colorGenerator = new InterpolateColorGenerator(colors);
            }
            break;

          case SCHEME_IS_CONTINUOUS:
            d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
            colors = getColorsWithD3PresetColor(
              `interpolate${d3ColorScheme}`,
              numOfGradation
            );
            colorGenerator = new InterpolateColorGenerator(colors);
            break;
        }
        break;
    }

    switch (colorCirculation) {
      case CIRCULATE:
        colorChips.innerHTML = [...Array(numOfGradation)]
          .map((_, index) => {
            return `<li data-pos="${index}" style="background: ${colorGenerator.get(
              index
            )}"></li>`;
          })
          .join("");
        break;

      case INTERPOLATE:
        {
          const unit = 1 / (numOfGradation - 1);
          colorChips.innerHTML = [...Array(numOfGradation)]
            .map((_, index) => {
              return `<li data-pos="${
                index * unit
              }" style="background: ${colorGenerator.get(index * unit)}"></li>`;
            })
            .join("");
        }
        break;
    }
  }

  // getColorSeries() {
  //   const getPropertyValue = (key) =>
  //     window.getComputedStyle(this.element).getPropertyValue(key);
  //   const series = Array(6);
  //   for (let i = 0; i < series.length; i++) {
  //     series[i] = `--togostanza-series-${i}-color`;
  //   }
  //   return series.map((variable) => getPropertyValue(variable).trim());
  // }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': TestColorGenerator
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "test-color-generator",
	"stanza:label": "Test Color Genarator",
	"stanza:definition": "Test Color Genarator MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-05-22",
	"stanza:updated": "2022-01-23",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/3sets-data.json",
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
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 380,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "number-of-gradation",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Number of Gradation"
	},
	{
		"stanza:key": "number-of-make-color",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Number of make color (Only circulate with range and domain)"
	},
	{
		"stanza:key": "type-of-color-circulation",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"circulate",
			"interpolate"
		],
		"stanza:example": "circulate",
		"stanza:description": "How the color circulations (by categorical colors)"
	},
	{
		"stanza:key": "color-scheme",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"Categorical-Custom (6)",
			"Categorical-Category10 (10)",
			"Categorical-Accent (8)",
			"Categorical-Dark2 (8)",
			"Categorical-Paired (12)",
			"Categorical-Pastel1 (9)",
			"Categorical-Pastel2 (8)",
			"Categorical-Set1 (9)",
			"Categorical-Set2 (8)",
			"Categorical-Set3 (12)",
			"Categorical-Tableau10 (10)",
			"Continuous-BrBG",
			"Continuous-PRGn",
			"Continuous-PiYG",
			"Continuous-PuOr",
			"Continuous-RdBu",
			"Continuous-RdGy",
			"Continuous-RdYlBu",
			"Continuous-RdYlGn",
			"Continuous-Spectral",
			"Continuous-Blues",
			"Continuous-Greens",
			"Continuous-Greys",
			"Continuous-Oranges",
			"Continuous-Purples",
			"Continuous-Reds",
			"Continuous-Turbo",
			"Continuous-Viridis",
			"Continuous-Inferno",
			"Continuous-Magma",
			"Continuous-Plasma",
			"Continuous-Cividis",
			"Continuous-Warm",
			"Continuous-Cool",
			"Continuous-CubehelixDefault",
			"Continuous-BuGn",
			"Continuous-BuPu",
			"Continuous-GnBu",
			"Continuous-OrRd",
			"Continuous-PuBuGn",
			"Continuous-PuBu",
			"Continuous-PuRd",
			"Continuous-RdPu",
			"Continuous-YlGnBu",
			"Continuous-YlGn",
			"Continuous-YlOrBr",
			"Continuous-YlOrRd",
			"Continuous-Rainbow",
			"Continuous-Sinebow"
		],
		"stanza:example": "Categorical-Custom (6)",
		"stanza:description": "\"Custom\" uses user-defined colors"
	},
	{
		"stanza:key": "color-range",
		"stanza:type": "string",
		"stanza:example": "red,blue,yellow",
		"stanza:description": "Color set"
	},
	{
		"stanza:key": "color-domain",
		"stanza:type": "string",
		"stanza:example": "0,0.25,1",
		"stanza:description": "Color range"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
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
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Label font size"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n\n  <ul id=\"color-chips\"></ul>\n\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=test-color-generator.js.map
