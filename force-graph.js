import { s as select, S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, g as defineStanzaElement } from './index-ec45d824.js';
import { l as loadData } from './load-data-f1dd0e29.js';
import { T as ToolTip } from './ToolTip-88ebaba8.js';
import { l as line$2 } from './line-fbadf484.js';
import { f as forceSimulation, a as forceManyBody, b as forceCenter, c as forceLink, d as forceCollide } from './manyBody-72bcefd9.js';
import { d as drag } from './drag-42ae229e.js';
import { p as prepareGraphData } from './prepareGraphData-d246a92a.js';
import { o as ordinal } from './linear-1b2cc043.js';
import './ref-3bab6ed0.js';
import './array-80a7907a.js';
import './constant-c49047a5.js';
import './path-f2817c20.js';
import './point-7945b9d0.js';
import './nodrag-2f0c68ae.js';
import './extent-14a1e8e9.js';
import './v4-1d7bfe79.js';
import './log-b4392039.js';
import './pow-74e84aac.js';

function straightLink(d) {
  const start = { x: d.source.x, y: d.source.y };
  const end = { x: d.target.x, y: d.target.y };
  return `M ${start.x} ${start.y}, L ${end.x} ${end.y}`;
}

function rotatePoint(pivot, point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  point.x -= pivot.x;
  point.y -= pivot.y;

  const newX = point.x * cos - point.y * sin;
  const newY = point.x * sin + point.y * cos;

  point.x = pivot.x + newX;
  point.y = pivot.y + newY;
}

function curvedLink(d, curveDir) {
  const start = { x: d.source.x, y: d.source.y };
  const end = { x: d.target.x, y: d.target.y };

  const L = Math.sqrt(
    (start.y - end.y) * (start.y - end.y) +
      (start.x - end.x) * (start.x - end.x)
  );

  const theta = Math.atan((end.y - start.y) / (end.x - start.x));

  const p1 = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  rotatePoint(start, p1, -theta);

  p1.y += (L / 5) * curveDir;

  rotatePoint(start, p1, theta);

  return `M ${start.x} ${start.y}
            S ${p1.x} ${p1.y}, ${end.x} ${end.y}`;
}

function drawForceLayout (
  svg,
  nodes,
  edges,
  {
    width,
    height,
    MARGIN,
    labelsParams,
    tooltipParams,
    highlightAdjEdges,
    edgeWidthParams,
    symbols,
  }
) {
  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  function drawLink(d) {
    if (d[symbols.isPairEdge]) {
      return curvedLink(d, d[symbols.isPairEdge]);
    } else {
      return straightLink(d);
    }
  }

  const markerBoxWidth = 8;
  const markerBoxHeight = 4;
  const refX = markerBoxWidth;
  const refY = markerBoxHeight / 2;

  const arrowPoints = [
    [0, 0],
    [0, markerBoxHeight],
    [markerBoxWidth, markerBoxHeight / 2],
  ];

  if (edgeWidthParams.showArrows) {
    const defs = svg.append("defs");

    const defsD = defs.selectAll("marker").data(edges);

    defsD
      .enter()
      .append("marker")
      .attr(
        "id",
        (d) => d[symbols.idSym] // edge id
      )
      .attr("viewBox", [0, 0, markerBoxWidth, markerBoxHeight])
      .attr(
        "refX",
        (d) =>
          refX +
          d[symbols.targetNodeSym][symbols.nodeSizeSym] /
            d[symbols.edgeWidthSym]
      )
      .attr("refY", refY)
      .attr("markerWidth", markerBoxWidth)
      .attr("markerHeight", markerBoxHeight)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", line$2()(arrowPoints))
      .attr("stroke", "none")
      .attr("style", (d) =>
        d[symbols.edgeColorSym] ? `fill: ${d[symbols.edgeColorSym]}` : null
      )
      .attr("fill-opacity", 1);
  }

  const forceG = svg
    .append("g")
    .attr("id", "forceG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const gLinks = forceG.append("g").attr("class", "links");
  const gNodes = forceG.append("g").attr("class", "nodes");

  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-100))
    .force("center", forceCenter(width / 2, height / 2).strength(0.05))
    .force(
      "link",
      forceLink()
        .links(edges)
        .id((d) => d.id)
        .distance(50)
        .strength(0.5)
    )
    .force(
      "collide",
      forceCollide()
        .radius((d) => d[symbols.nodeSizeSym])
        .iterations(2)
        .strength(0.9)
    )
    .on("tick", ticked);

  const links = gLinks
    .selectAll("path")
    .data(edges)
    .join("path")
    .attr("d", drawLink)
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
    .attr("class", "link")
    .attr("marker-end", (d) => `url(#${d[symbols.idSym] || "default"})`);

  function updateLinks() {
    links.attr("d", drawLink);
  }
  function updateNodes() {
    nodeGroups.attr("transform", (d) => {
      const r = d[symbols.nodeSizeSym];
      const dx = Math.max(r, Math.min(WIDTH - r, d.x));
      const dy = Math.max(r, Math.min(HEIGHT - r, d.y));
      d.x = dx;
      d.y = dy;
      return `translate(${d.x},${d.y})`;
    });
  }

  function ticked() {
    updateNodes();
    updateLinks();
  }

  const nodeGroups = gNodes
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`;
    })
    .call(drag$1(simulation));

  const nodeCircles = nodeGroups
    .append("circle")
    .attr("class", "node")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => d[symbols.nodeSizeSym])
    .style("fill", (d) => d[symbols.nodeColorSym]);

  if (tooltipParams.show) {
    nodeCircles.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
  }

  if (labelsParams.dataKey !== "" && nodes[0][labelsParams.dataKey]) {
    nodeGroups
      .append("text")
      .attr("x", 0)
      .attr("dy", (d) => labelsParams.margin + d[symbols.nodeSizeSym])
      .attr("class", "label")
      .attr("alignment-baseline", "hanging")
      .attr("text-anchor", "middle")
      .text((d) => d[labelsParams.dataKey]);
  }

  let isDragging = false;

  function drag$1(simulation) {
    function dragstarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      isDragging = true;
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      isDragging = false;
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  if (highlightAdjEdges) {
    nodeGroups.on("mouseover", function (e, d) {
      if (isDragging) {
        return;
      }
      // highlight current node
      select(this).classed("active", true);
      // fade out all other nodes, highlight a little connected ones
      nodeGroups
        .classed("fadeout", (p) => d !== p)
        .classed("half-active", (p) => {
          return (
            p !== d &&
            d[symbols.edgeSym].some(
              (edge) =>
                edge[symbols.sourceNodeSym] === p ||
                edge[symbols.targetNodeSym] === p
            )
          );
        });

      // fadeout not connected edges, highlight connected ones
      links
        .classed("fadeout", (p) => !d[symbols.edgeSym].includes(p))
        .classed("active", (p) => d[symbols.edgeSym].includes(p));
    });

    nodeGroups.on("mouseleave", function () {
      if (isDragging) {
        return;
      }
      links
        .classed("active", false)
        .classed("fadeout", false)
        .classed("half-active", false);
      nodeGroups
        .classed("active", false)
        .classed("fadeout", false)
        .classed("half-active", false);
    });
  }
}

class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "force-graph"),
      downloadPngMenuItem(this, "force-graph"),
      downloadJSONMenuItem(this, "force-graph", this._data),
      downloadCSVMenuItem(this, "force-graph", this._data),
      downloadTSVMenuItem(this, "force-graph", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const setFallbackVal = (param, defVal) => {
      return isNaN(parseFloat(this.params[param]))
        ? defVal
        : this.params[param];
    };

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("force-graph");

    //data
    const width = parseInt(css("--togostanza-canvas-width"));
    const height = parseInt(css("--togostanza-canvas-height"));

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const nodeSizeParams = {
      dataKey: this.params["node-size_key"] || "",
      minSize: setFallbackVal("node-size_min", 0),
      maxSize: this.params["node-size_max"],
      scale: this.params["node-size_scale"] || "linear",
    };

    const nodeColorParams = {
      dataKey: this.params["node-color_key"] || "",
    };

    const edgeWidthParams = {
      dataKey: this.params["edge-width_key"] || "",
      minWidth: setFallbackVal("edge-width_min", 1),
      maxWidth: this.params["edge-width_max"],
      scale: this.params["edge-width_scale"] || "linear",
      showArrows: this.params["edge-arrows_visible"],
    };

    const edgeColorParams = {
      basedOn: "data key",
      dataKey: Symbol(),
    };

    const labelsParams = {
      margin: 3,
      dataKey: this.params["node-label_key"],
    };

    const highlightAdjEdges = true;

    const MARGIN = getMarginsFromCSSString(css("--togostanza-canvas-padding"));

    const tooltipParams = {
      dataKey: this.params["node-tooltip_key"],
      show: nodes.some((d) => d[this.params["node-tooltip_key"]]),
    };

    // Setting color scale
    const togostanzaColors = [];

    let i = 0;

    let togoColor = css(`--togostanza-theme-series_${i}_color`)
      .trim()
      .toUpperCase();

    while (togoColor) {
      togostanzaColors.push(togoColor);
      i++;
      togoColor = css(`--togostanza-theme-series_${i}_color`)
        .trim()
        .toUpperCase();
    }

    const color = function () {
      return ordinal().range(togostanzaColors);
    };

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }
    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodeSizeParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      labelsParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    drawForceLayout(svg, prepNodes, prepEdges, {
      ...params,
      symbols,
    });

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}

function getMarginsFromCSSString(str) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0,
  };

  switch (splitted.length) {
    case 1:
      res.TOP = res.RIGHT = res.BOTTOM = res.LEFT = parseInt(splitted[0]);
      break;
    case 2:
      res.TOP = res.BOTTOM = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      break;
    case 3:
      res.TOP = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      break;
    case 4:
      res.TOP = parseInt(splitted[0]);
      res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      res.LEFT = parseInt(splitted[3]);
      break;
  }

  return res;
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ForceGraph
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "force-graph",
	"stanza:label": "Force graph",
	"stanza:definition": "Force graph MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2022-03-28",
	"stanza:updated": "2022-10-21",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://gist.githubusercontent.com/abkunal/98d35b9b235312e90f3e43c9f7b6932b/raw/d5589ddd53731ae8eec7abd091320df91cdcf5cd/miserables.json",
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
		"stanza:key": "node-size_key",
		"stanza:type": "string",
		"stanza:example": "",
		"stanza:description": "Set size on the node based on data key, or fallback to value of node-size-min"
	},
	{
		"stanza:key": "node-size_min",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Minimum node radius in px (fallback to 0)"
	},
	{
		"stanza:key": "node-size_max",
		"stanza:type": "number",
		"stanza:example": 6,
		"stanza:description": "Maximum node radius in px"
	},
	{
		"stanza:key": "node-size_scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"square root",
			"log10"
		],
		"stanza:example": "square root",
		"stanza:description": "Node radius scale"
	},
	{
		"stanza:key": "node-color_key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set color of the node based on data key"
	},
	{
		"stanza:key": "edge-width_key",
		"stanza:type": "string",
		"stanza:example": "value",
		"stanza:description": "Set width of the edge  data key"
	},
	{
		"stanza:key": "edge-width_min",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "Minimum edge width in px"
	},
	{
		"stanza:key": "edge-width_max",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "Maximum edge width in px"
	},
	{
		"stanza:key": "edge-width_scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"square root",
			"log10"
		],
		"stanza:example": "linear",
		"stanza:description": "Edge width scale"
	},
	{
		"stanza:key": "edge-arrows_visible",
		"stanza:type": "boolean",
		"stanza:example": "true",
		"stanza:description": "Show arrows"
	},
	{
		"stanza:key": "node-label_key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node labels data key. If empty, no labels will be shown"
	},
	{
		"stanza:key": "node-tooltip_key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node tooltips data key. If empty, no tooltips will be shown"
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(scss file) URL to override current style",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-canvas-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Metastanza width in px"
	},
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 800,
		"stanza:description": "Metastanza height in px"
	},
	{
		"stanza:key": "--togostanza-canvas-padding",
		"stanza:type": "text",
		"stanza:default": "20 30",
		"stanza:description": "Metastanza padding"
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
		"stanza:default": "#E6BB1A",
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
		"stanza:key": "--togostanza-edge-default_color",
		"stanza:type": "color",
		"stanza:default": "#bdbdbd",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-edge-opacity",
		"stanza:type": "number",
		"stanza:default": 0.8,
		"stanza:description": "Edge default opacity"
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
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"force-graph\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=force-graph.js.map
