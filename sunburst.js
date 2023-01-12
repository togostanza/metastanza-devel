import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, s as select, g as defineStanzaElement } from './index-ec45d824.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { g as getMarginsFromCSSString } from './utils-95f80352.js';
import { S as StanzaColorGenerator } from './ColorGenerator-3e801856.js';
import { o as ordinal, f as format, D as interpolate$1 } from './linear-1b2cc043.js';
import { s as stratify, h as hierarchy } from './stratify-7050dfd9.js';
import { m as max } from './max-2c042256.js';
import { a as arc$2 } from './arc-b062fe01.js';
import { s as sum } from './sum-44e7480e.js';
import { p as partition } from './partition-e955ad6c.js';
import { p as path$1 } from './path-f2817c20.js';
import './constant-c49047a5.js';
import './math-24162d65.js';
import './dice-7bdb0652.js';

let path;

class Sunburst extends Stanza {
  constructor(...args) {
    super(...args);
    this.state = {
      currentId: null,
    };
  }

  menu() {
    return [
      downloadSvgMenuItem(this, "sunburst"),
      downloadPngMenuItem(this, "sunburst"),
      downloadJSONMenuItem(this, "sunburst", this._data),
      downloadCSVMenuItem(this, "sunburst", this._data),
      downloadTSVMenuItem(this, "sunburst", this._data),
    ];
  }

  handleEvent(event) {
    event.stopPropagation();
    if (event.target !== this.element) {
      this.state.currentId = "" + event.detail.id;
    }
  }

  async render() {
    this.state = new Proxy(this.state, {
      set(target, key, value) {
        if (key === "currentId") {
          updateId(getNodeById(value));
        }
        return Reflect.set;
      },
      get: Reflect.get,
    });

    const dispatchEvent = (value) => {
      dispatcher.dispatchEvent(
        new CustomEvent("selectedDatumChanged", {
          detail: { id: "" + value },
        })
      );
    };

    const state = this.state;

    const dispatcher = this.element;

    appendCustomCss(this, this.params["custom_css_url"]);
    // get value of css vars
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = parseFloat(css("--togostanza-canvas-width"));
    const height = parseFloat(css("--togostanza-canvas-height"));
    const padding = getMarginsFromCSSString(css("--togostanza-canvas-padding"));

    const labelKey = this.params["node-label_key"];
    const valueKey = this.params["node-value_key"];
    const showNumbers = this.params["node-show_values"];
    const borderWidth = this.params["node-levels_gap_width"] || 2;
    const nodesGapWidth = this.params["node-gap_width"] || 8;
    const cornerRadius = this.params["node-corner_radius"] || 0;
    const scalingMethod = this.params["scaling"] || "By value";
    let depthLim =
      parseFloat(this.params["max_depth"]) > 0
        ? parseFloat(this.params["max_depth"])
        : 1;

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = data;

    const colorScale = new StanzaColorGenerator(this).stanzaColor;
    const color = ordinal(colorScale);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    data.forEach((node) => {
      node.id = "" + node.id;
      if (node?.children) {
        node.children = node.children.map((child) => "" + child);
      }
      if (node?.parent) {
        node.parent = "" + node.parent;
      }
    });

    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElemIndexes = [];
    data.forEach((node, index) => {
      if (!node.parent) {
        rootElemIndexes.push(index);
      }
    });

    if (rootElemIndexes.length > 1 || !data.find((item) => item.id === "-1")) {
      const rootElem = {
        id: "-1",
        value: "",
      };
      data.push(rootElem);

      rootElemIndexes.forEach((index) => {
        data[index].parent = rootElem.id;
      });
    }

    const dataset = data.filter(
      (item) =>
        (item.children && !item[valueKey]) ||
        (item[valueKey] && item[valueKey] > 0) ||
        item.id === "-1"
    );

    const el = this.root.querySelector("#sunburst");

    const stratifiedData = stratify()
      .id(function (d) {
        return d.id;
      })
      .parentId(function (d) {
        return d.parent;
      })(dataset);

    const formatNumber = format(",d");

    const partition$1 = (data) => {
      const root = hierarchy(data);
      switch (scalingMethod) {
        case "By value":
          root.sum((d) => d.data[valueKey]);
          break;
        case "Equal children":
          root.sum((d) => (d.children ? 0 : 1));
          break;
        case "Equal parents":
          root.each(
            (d) =>
              (d.value = d.parent
                ? d.parent.value / d.parent.children.length
                : 1)
          );
          break;
      }

      root
        .sort((a, b) => b.value - a.value)
        // store real values for number labels in d.value2
        .each((d) => (d.value2 = sum(d, (dd) => dd.data.data[valueKey])));
      return partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const root = partition$1(stratifiedData);

    root.each((d) => (d.current = d));

    // if depthLim 0 of negative, show all levels
    const maxDepth = max(root, (d) => d.depth);
    if (depthLim <= 0 || depthLim > maxDepth) {
      depthLim = maxDepth;
    }

    const radius =
      Math.min(
        width - padding.LEFT - padding.RIGHT,
        height - padding.TOP - padding.BOTTOM
      ) /
      ((depthLim + 1) * 2);

    if (
      padding.LEFT + padding.RIGHT >= width ||
      padding.TOP + padding.BOTTOM >= height
    ) {
      el.innerHTML = "<p>Padding is too big for given width and height!</p>";
      throw new Error("Padding is too big for given width and height!");
    }

    const arc = arc$2()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, nodesGapWidth / 500))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * radius)
      .outerRadius((d) =>
        Math.max(d.y0 * radius, d.y1 * radius - borderWidth / 2)
      )
      .cornerRadius(cornerRadius);

    const middleArcLabelLine = (d) => {
      const halfPi = Math.PI / 2;
      const angles = [d.x0 - halfPi, d.x1 - halfPi];
      let r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);
        angles.reverse();
      }

      if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
        angles[0] = middleAngle + Math.PI / 2;
        angles[1] = middleAngle - Math.PI / 2;

        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 5) * radius);
      }

      const path = path$1();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    const middleArcNumberLine = (d) => {
      const halfPi = Math.PI / 2;
      const angles = [d.x0 - halfPi, d.x1 - halfPi];
      let r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

        angles.reverse();
      }

      if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
        r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);
      }

      const path = path$1();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    function textFits(d, charWidth, text) {
      if (!text || !text.length) {
        return true;
      }
      const deltaAngle = d.x1 - d.x0;
      const r = Math.max(0, ((d.y0 + d.y1) * radius) / 2);
      const perimeter = r * deltaAngle;

      return text.length * charWidth < perimeter;
    }

    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    //Get character width
    const testText = svg
      .append("g")
      .attr("class", "labels")
      .append("text")
      .text("a");
    const CHAR_SPACE = testText.node().getComputedTextLength();
    testText.remove();

    const g = svg.append("g");

    path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) {
          d = d.parent;
        }
        if (d.data.data.id === "-1") {
          return "none";
        }

        return color(d.data.data.id);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("d", (d) => arc(d.current));

    path
      .filter((d) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title").text((d) => {
      return `${d
        .ancestors()
        .map((d) => d.data.data[labelKey])
        .reverse()
        .join("/")}\n${formatNumber(d.value2)}`;
    });

    //add hidden arcs for text
    const textArcs = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("class", "hidden-arc")
      .attr("id", (_, i) => `hiddenLabelArc${i}`)
      .attr("d", middleArcLabelLine);

    //For numbers
    const numArcs = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("class", "hidden-arc")
      .attr("id", (_, i) => `hiddenNumberArc${i}`)
      .attr("d", middleArcNumberLine);

    // Center circle
    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius - borderWidth / 2)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    //Text labels
    const textLabels = g
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr(
        "fill-opacity",
        (d) =>
          +(labelVisible(d) && textFits(d, CHAR_SPACE, d.data.data[labelKey]))
      )
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenLabelArc${i}`)
      .text((d) => d.data.data[labelKey]);

    //Number labels
    const numLabels = g
      .append("g")
      .attr("class", "numbers")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      //Show only if label is supposed to be shown, label text fits into node and showNumbers =true
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d) &&
            textFits(d, CHAR_SPACE, d.data.data[labelKey]) &&
            showNumbers
          )
      )
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenNumberArc${i}`)
      .text((d) => formatNumber(d.value2));

    function clicked(_e, p) {
      state.currentId = p.data.data.id;

      dispatchEvent(p.data.data.id);
    }

    function getNodeById(id) {
      return root.descendants().find((d) => d.data.data.id === id);
    }

    function updateId(p) {
      if (!arcVisible(p.current) && p.current.y1 > 1) {
        return;
      }

      parent.datum(p.parent || root);

      parent.attr("cursor", (d) => (d === root ? "auto" : "pointer"));

      root.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path
        .transition(t)
        .tween("data", (d) => {
          const i = interpolate$1(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("cursor", (d) =>
          d.children && arcVisible(d.target) ? "pointer" : "auto"
        )

        .attrTween("d", (d) => () => arc(d.current));

      parent.transition(t).attr("fill", () => {
        let b = p;
        while (b.depth > 1) {
          b = b.parent;
        }

        return b.data?.data?.[labelKey]
          ? color(b.data.data.id)
          : "rgba(0,0,0,0)";
      });

      textLabels
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || +labelVisible(d.target);
        })
        .transition(t)
        .attr(
          "fill-opacity",
          (d) =>
            +(
              labelVisible(d.target) &&
              textFits(d.target, CHAR_SPACE, d.data.data[labelKey])
            )
        );

      textArcs
        .transition(t)
        .attrTween("d", (d) => () => middleArcLabelLine(d.current));

      numLabels
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr(
          "fill-opacity",
          (d) =>
            +(
              labelVisible(d.target) &&
              textFits(d.target, CHAR_SPACE, d.data.data[labelKey]) &&
              showNumbers
            )
        );

      numArcs
        .transition(t)
        .attrTween("d", (d) => () => middleArcNumberLine(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= depthLim + 1 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= depthLim + 1 && d.y0 >= 0;
    }
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Sunburst
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "sunburst",
	"stanza:label": "Sunburst",
	"stanza:definition": "Sunburst MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-10-28",
	"stanza:updated": "2021-10-28",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
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
		"stanza:key": "node-value_key",
		"stanza:type": "text",
		"stanza:example": "size",
		"stanza:description": "Data key to use as a value",
		"stanza:required": true
	},
	{
		"stanza:key": "node-label_key",
		"stanza:type": "text",
		"stanza:example": "label",
		"stanza:description": "Data key to use as a title"
	},
	{
		"stanza:key": "node-show_values",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show numbers under labels"
	},
	{
		"stanza:key": "node-levels_gap_width",
		"stanza:type": "number",
		"stanza:example": 2,
		"stanza:description": "Width of gap between different levels"
	},
	{
		"stanza:key": "node-gap_width",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "Gap between chart nodes that are on same level, unitless coefficient"
	},
	{
		"stanza:key": "node-corner_radius",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Corner radius on a node"
	},
	{
		"stanza:key": "scaling",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"By value",
			"Equal children",
			"Equal parents"
		],
		"stanza:example": "By value",
		"stanza:description": "Scaling of the nodes"
	},
	{
		"stanza:key": "max_depth",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Maximum depth to show"
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
		"stanza:key": "--togostanza-canvas-width",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Canvas width"
	},
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 400,
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
		"stanza:description": "Color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Color 5"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Color 6"
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
		"stanza:description": "Label font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 11,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_secondary",
		"stanza:type": "number",
		"stanza:default": 7,
		"stanza:description": "Number label font size"
	}
],
	"stanza:incomingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "Event, wich dispatches when user selects some node in other stanza"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "Event, wich dispatches when user selects some node"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"sunburst\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=sunburst.js.map
