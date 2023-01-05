import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, g as defineStanzaElement } from './index-b37241ec.js';
import { l as loadData } from './load-data-0ddebadb.js';
import { g as getMarginsFromCSSString } from './utils-1a48cc93.js';

class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
      downloadCSVMenuItem(this, "scorecard", this._data),
      downloadTSVMenuItem(this, "scorecard", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom_css_url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });
    const main = this.root.querySelector("main");
    const el = this.root.getElementById("scorecard");

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      main
    );

    const width = parseFloat(css("--togostanza-outline-width")) || 0;
    const height = parseFloat(css("--togostanza-outline-height")) || 0;
    const padding = getMarginsFromCSSString(
      css("--togostanza-outline-padding")
    );
    const fontSizePrimary =
      parseFloat(css("--togostanza-fonts-font_size_primary")) || 0;
    const fontSizeSecondary =
      parseFloat(css("--togostanza-fonts-font_size_secondary")) || 0;

    const scoreKey = this.params["score-key"];
    const titleKey = this.params["title-key"];
    const scoreValue = dataset[scoreKey];
    this._data = [{ [scoreKey]: scoreValue }];

    const titleText =
      this.params["title-text"] || dataset[titleKey] || scoreKey;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", padding.LEFT + width + padding.RIGHT);
    svg.setAttribute("height", padding.TOP + height + padding.BOTTOM);
    svg.classList.add("svg");
    el.appendChild(svg);

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(wrapper);

    const titleKeyText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    titleKeyText.classList.add("title-key");
    titleKeyText.textContent = titleText;
    titleKeyText.setAttribute("text-anchor", "middle");
    wrapper.append(titleKeyText);

    const scoreValueText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    scoreValueText.classList.add("score-value");
    scoreValueText.textContent = scoreValue;
    scoreValueText.setAttribute("text-anchor", "middle");
    wrapper.append(scoreValueText);

    if (this.params["title-show"]) {
      titleKeyText.setAttribute("y", fontSizeSecondary);
      scoreValueText.setAttribute("y", fontSizePrimary + fontSizeSecondary);
    } else {
      titleKeyText.setAttribute(`style`, `display: none;`);
      scoreValueText.setAttribute("y", fontSizePrimary);
    }

    wrapper.setAttribute(
      "transform",
      `translate(${padding.LEFT + width / 2},
      ${padding.TOP + height / 2 - wrapper.getBBox().height / 2})`
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
		"stanza:default": 320,
		"stanza:description": "Metastanza width in px"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 110,
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
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"scorecard\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scorecard.js.map
