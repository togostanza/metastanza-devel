import { S as Stanza, d as defineStanzaElement } from './transform-4eef39d8.js';
import { l as loadData } from './load-data-13013bfb.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, f as appendCustomCss } from './index-0a21be6d.js';

class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const scoreKey = this.params["score-key"];
    const titleKey = this.params["title-key"];
    const scoreValue = dataset[scoreKey];
    this._data = { [scoreKey]: scoreValue };

    const titleText =
      this.params["title-text"] || dataset[titleKey] || scoreKey;

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        scorecards: [
          {
            titleText,
            scoreValue,
          },
        ],
      },
    });

    const keyElement = this.root.querySelector("#key");
    const valueElement = this.root.querySelector("#value");
    if (this.params["title-show"] === false) {
      keyElement.setAttribute(`style`, `display: none;`);
    }

    keyElement.setAttribute(
      "y",
      Number(css("--togostanza-fonts-font_size_secondary"))
    );
    keyElement.setAttribute(
      "fill",
      "var(--togostanza-fonts-font_color_secondary)"
    );
    valueElement.setAttribute(
      "y",
      Number(css("--togostanza-fonts-font_size_secondary")) +
        Number(css("--togostanza-fonts-font_size_primary"))
    );
    valueElement.setAttribute(
      "fill",
      "var(--togostanza-fonts-font_color_primary)"
    );
    keyElement.setAttribute(
      "font-size",
      css("--togostanza-fonts-font_size_secondary")
    );
    valueElement.setAttribute(
      "font-size",
      css("--togostanza-fonts-font_size_primary")
    );
    keyElement.setAttribute(
      "font-weight",
      css("--togostanza-fonts-font_weight_secondary")
    );
    valueElement.setAttribute(
      "font-weight",
      css("--togostanza-fonts-font_weight_primary")
    );
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Scorecard
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scorecard",
	"stanza:label": "Scorecard",
	"stanza:definition": "Scorecard MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2020-12-02",
	"stanza:updated": "2020-12-02",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/scorecard.json",
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
		"stanza:key": "score-key",
		"stanza:type": "text",
		"stanza:example": "value",
		"stanza:description": "Data key for score",
		"stanza:required": true
	},
	{
		"stanza:key": "title-key",
		"stanza:type": "text",
		"stanza:example": "key",
		"stanza:description": "Key of the title text. If not set, fallback to score-key param value"
	},
	{
		"stanza:key": "title-text",
		"stanza:type": "text",
		"stanza:example": "seq_length",
		"stanza:description": "Title of the score card"
	},
	{
		"stanza:key": "title-show",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show key name"
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-outline-width",
		"stanza:type": "number",
		"stanza:default": 300,
		"stanza:description": "Metastanza width in px"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 70,
		"stanza:description": "Metastanza height in px"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "text",
		"stanza:default": "50px",
		"stanza:description": "Padding of a stanza. CSS padding-like text (10px 10px 10px 10px)"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color_primary",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color for value"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 36,
		"stanza:description": "Font size for value"
	},
	{
		"stanza:key": "--togostanza-fonts-font_weight_primary",
		"stanza:type": "number",
		"stanza:default": 500,
		"stanza:description": "Font weight for value"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color_secondary",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Font color for key"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 16,
		"stanza:description": "Font size for key"
	},
	{
		"stanza:key": "--togostanza-fonts-font_weight_secondary",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Font weight for key"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <svg id=\"scorecardSvg\" class=\"scorecard-svg\">\n      <text id=\"text\" x=\"50%\" y=\"50%\" text-anchor=\"middle\">\n        <tspan id=\"key\" x=\"50%\" y=\"16px\" font-size=\"16px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"titleText") : stack1), depth0))
    + "\n        </tspan>\n        <tspan id=\"value\" x=\"50%\" y=\"48px\" font-size=\"32px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"scoreValue") : stack1), depth0))
    + "\n        </tspan>\n      </text>\n    </svg>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"chart-wrapper\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"scorecards") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":13,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scorecard.js.map
