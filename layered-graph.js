import { S as Stanza, s as select, d as defineStanzaElement } from './transform-53933414.js';
import { d as d3 } from './index-6868dabb.js';
import { _ as _3d } from './3d-7f166d8e.js';
import { l as loadData } from './load-data-f2c8df7b.js';
import { T as ToolTip } from './ToolTip-271f1a68.js';
import { S as StanzaColorGenerator } from './ColorGenerator-eaa87470.js';
import { p as prepareGraphData, g as get3DEdges, a as getGroupPlanes } from './prepareGraphData-11bba3c6.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-9bc9e50c.js';
import { l as line$2 } from './line-5ff356a1.js';
import { m as max } from './max-2c042256.js';
import { d as drag } from './drag-4fd06c1d.js';
import { p as point } from './band-407353db.js';
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
import './tree-0236e2eb.js';
import './symbol-6a0b2d8d.js';
import './log-17aebfea.js';
import './constant-c49047a5.js';
import './math-24162d65.js';
import './path-a78af922.js';
import './pow-e5124b28.js';
import './array-80a7907a.js';
import './point-7945b9d0.js';
import './basis-0dde91c7.js';
import './stack-a283014a.js';
import './extent-14a1e8e9.js';
import './dsv-ac31b097.js';
import './sum-44e7480e.js';
import './axis-3dba94d9.js';
import './ribbon-bbaf0468.js';
import './partition-e955ad6c.js';
import './create-5ec6ea56.js';
import './arc-8a3c109f.js';
import './link-3796f00e.js';
import './v4-1d7bfe79.js';

function straightLink(d, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };
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

function curvedLink(d, curveDir, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };

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

class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-3d-circle"),
      downloadPngMenuItem(this, "graph-3d-circle"),
      downloadJSONMenuItem(this, "graph-3d-circle", this._data),
      downloadCSVMenuItem(this, "graph-3d-circle", this._data),
      downloadTSVMenuItem(this, "graph-3d-circle", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["misc-custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const setFallbackNumVal = (value, defVal) => {
      return isNaN(parseFloat(value)) ? defVal : parseFloat(value);
    };

    //data

    const width = setFallbackNumVal(css("--togostanza-outline-width"), 200);
    const height = setFallbackNumVal(css("--togostanza-outline-height"), 200);
    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const cg = new StanzaColorGenerator(this);

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    // Setting color scale
    const togostanzaColors = cg.stanzaColor;

    const color = function (type = "scaleOrdinal") {
      return d3[type]().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("layered-graph");

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

    const constRarius = !!this.params["group_planes-constant_radius"];

    const groupPlaneColorParams = {
      colorPlane: false,
    };

    const groupsSortParams = {
      sortBy: this.params["group_planes-sort-key"],
      sortOrder: this.params["group_planes-sort-order"] || "ascending",
    };

    const nodesSortParams = {
      sortBy: this.params["nodes-sort-key"],
      sortOrder: this.params["nodes-sort-order"] || "ascending",
    };

    const nodeSizeParams = {
      dataKey: this.params["node-size-key"] || "",
      minSize: setFallbackNumVal(this.params["node-size-min"], 3),
      maxSize: this.params["node-size-max"],
      scale: this.params["node-size-scale"] || "linear",
    };

    const nodeColorParams = {
      dataKey: this.params["node-color-key"] || "",
    };

    const edgeWidthParams = {
      dataKey: this.params["edge-width-key"] || "",
      minWidth: setFallbackNumVal(this.params["edge-width-min"], 1),
      maxWidth: this.params["edge-width-max"],
      scale: this.params["edge-width-scale"] || "linear",
      showArrows: this.params["edge-show_arrows"],
    };

    const edgeColorParams = {
      basedOn: "data key",
      dataKey: Symbol(),
    };

    const tooltipParams = {
      dataKey: this.params["tooltips-key"],
      show: nodes.some((d) => d[this.params["tooltips-key"]]),
    };

    const highlightAdjEdges = true;
    const highlightGroupPlanes = this.params["highlight-group_planes"] || false;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodeSizeParams,
      nodesSortParams,
      groupsSortParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, groupHash, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    const targetAccessor = (d) => d.edge[symbols.targetNodeSym].projected;
    const sourceAccessor = (d) => d.edge[symbols.sourceNodeSym].projected;

    function drawLink(d) {
      if (d.edge[symbols.isPairEdge]) {
        return curvedLink(
          d,
          d.edge[symbols.isPairEdge],
          targetAccessor,
          sourceAccessor
        );
      } else {
        return straightLink(d, targetAccessor, sourceAccessor);
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

      const defsD = defs.selectAll("marker").data(prepEdges);

      defsD
        .enter()
        .append("marker")
        .attr(
          "id",
          (d) => d[symbols.idSym] // edge id
        )
        .attr("viewBox", [0, 0, markerBoxWidth, markerBoxHeight])
        .attr("refX", (d) => {
          return (
            refX +
            d[symbols.targetNodeSym][symbols.nodeSizeSym] /
              d[symbols.edgeWidthSym]
          );
        })
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

    const maxNodesInGroup = max(
      Object.entries(groupHash),
      (d) => d[1].length
    );

    const Rmax = (0.8 * WIDTH) / 2;

    const arcLength = ((2 * Math.PI) / maxNodesInGroup) * Rmax;

    const origin = [MARGIN.LEFT + WIDTH / 2, MARGIN.TOP + HEIGHT / 2];
    const scale = 0.75;

    let isDragging = false;

    const key = function (d) {
      return d.id;
    };

    const startAngle = (Math.PI * 8) / 180;

    const svgG = svg
      .call(
        drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      )
      .append("g");

    var mx, my, mouseX, mouseY;

    const point3d = _3d()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
      .z(function (d) {
        return d.z;
      })
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const edge3d = _3d()
      .scale(scale)
      .origin(origin)
      .shape("LINE")
      .rotateY(startAngle)
      .rotateX(-startAngle);

    const plane3d = _3d()
      .shape("LINE_STRIP")
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    function processData(data) {
      const planes = svgG
        .selectAll("path.group-plane")
        .data(data[2], (d) => d.groupId);

      planes
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("group-plane", true)
        .merge(planes)
        .attr("style", (d) => `fill: ${d.color}`)
        .attr("d", plane3d.draw)
        .sort(plane3d.sort);

      planes.exit().remove();

      const linesStrip = svgG.selectAll("path.link").data(data[1]);

      linesStrip
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("link", true)
        .merge(linesStrip)
        .style("stroke", (d) => d.edge[symbols.edgeColorSym])
        .style("stroke-width", (d) => d.edge[symbols.edgeWidthSym])
        .attr("d", drawLink)
        .sort(edge3d.sort)
        .attr(
          "marker-end",
          (d) => `url(#${d.edge[symbols.idSym] || "default"})`
        );

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      const p = points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .classed("node", true)
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", (d) => d[symbols.nodeSizeSym])
        .style("fill", (d) => d[symbols.nodeColorSym])
        .sort(point3d.sort);

      if (tooltipParams.show) {
        p.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
      }

      points.exit().remove();
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    let groupPlanes = [];

    let edgesWithCoords = [];
    function init() {
      // Add x,y,z of source and target nodes to 3D edges
      edgesWithCoords = get3DEdges(prepEdges);

      // Laying out nodes=========
      const DEPTH = HEIGHT;
      const yPointScale = point([-DEPTH / 2, DEPTH / 2]).domain(
        Object.keys(groupHash).sort((a, b) => {
          if (a > b) {
            return groupsSortParams.sortOrder === "ascending" ? 1 : -1;
          }
          if (a < b) {
            return groupsSortParams.sortOrder === "ascending" ? -1 : 1;
          }
          return 0;
        })
      );

      Object.keys(groupHash).forEach((gKey) => {
        // Laying out nodes ===

        const group = groupHash[gKey];

        const angleScale = point()
          .domain(group.map((node) => node.id))
          .range([0, Math.PI * 2 - (Math.PI * 2) / group.length]);

        const R = constRarius
          ? Rmax
          : arcLength / ((Math.PI * 2) / group.length);

        group.forEach((node) => {
          if (group.length === 1) {
            node.x = 0;
            node.z = 0;
            node.y = yPointScale(gKey);
            return;
          }

          node.x = R * Math.cos(angleScale(node.id));
          node.z = R * Math.sin(angleScale(node.id));
          node.y = yPointScale(gKey);
        });
      });

      groupPlanes = getGroupPlanes(
        groupHash,
        {
          WIDTH,
          HEIGHT,
          DEPTH,
          color,
          yPointScale,
          groupPlaneColorParams,
        },
        true
      );

      const data = [
        point3d(prepNodes),
        edge3d(edgesWithCoords),
        plane3d(groupPlanes),
      ];

      processData(data);

      const planes = svgG.selectAll("path.group-plane");
      const points = svgG.selectAll("circle.node");
      const links = svgG.selectAll("path.link");

      if (highlightGroupPlanes) {
        addPlanesHighlight(planes, points, links);
      }

      {
        addEdgesHighlight(points, links);
      }
    }

    function dragStart(e) {
      isDragging = true;
      mx = e.x;
      my = e.y;
    }

    function dragged(e) {
      let alpha = 0;
      let beta = 0;

      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((e.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((e.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = [
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          prepNodes
        ),
        edge3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          edgesWithCoords
        ),
        plane3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          groupPlanes
        ),
      ];
      processData(data);
    }

    function dragEnd(e) {
      isDragging = false;
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    function addPlanesHighlight(planes, points, links) {
      planes.on("mouseover", function (_e, d) {
        if (isDragging) {
          return;
        }

        const group = d.group;

        const nodesIdsInGroup = group.map((node) => node.id);

        const edgesConnectedToThisGroup = prepEdges.filter((edge) => {
          return (
            nodesIdsInGroup.includes(edge.source) ||
            nodesIdsInGroup.includes(edge.target)
          );
        });

        const sourcesGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.sourceNodeSym].group
        );
        const targetsGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.targetNodeSym].group
        );

        const connectedTargetNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.target
        );

        const connectedSourceNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.source
        );

        const allConnectedNodes = [
          ...new Set([...connectedTargetNodes, ...connectedSourceNodes]),
        ];
        const connectedNodes = allConnectedNodes.filter(
          (nodeId) => !nodesIdsInGroup.includes(nodeId)
        );

        const allGroups = [...new Set([...sourcesGroups, ...targetsGroups])];
        const connectedGroups = allGroups.filter(
          (group) => group !== d.groupId
        );

        planes.classed("fadeout", true);
        planes.classed("active", false);
        planes.classed("half-active", false);

        planes
          .filter((p) => {
            return connectedGroups.includes(p.groupId);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        select(this).classed("active", true).classed("fadeout", false);

        // highlight nodes belonging to this group
        points.classed("fadeout", true);
        points.classed("active", false);
        points.classed("half-active", false);

        points
          .filter((p) => {
            return nodesIdsInGroup.includes(p.id);
          })
          .classed("fadeout", false)
          .classed("active", true);

        points
          .filter((p) => {
            return connectedNodes.includes("" + p.id);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        // highlight edges that belongs to this group
        links.classed("fadeout", true);

        links
          .filter((p) => {
            return (
              (connectedNodes.includes(p.edge[symbols.sourceNodeSym].id) ||
                connectedNodes.includes(p.edge[symbols.targetNodeSym].id)) &&
              (nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) ||
                nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id))
            );
          })
          .classed("fadeout", false)
          .classed("half-active", true)
          .classed("dashed", true);

        links
          .filter(
            (p) =>
              nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) &&
              nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id)
          )
          .classed("fadeout", false)
          .classed("active", true);
      });

      planes.on("mouseleave", () => {
        if (isDragging) {
          return;
        }
        links.classed("fadeout", false);
        links.classed("active", false);
        links.classed("half-active", false);
        links.classed("dashed", false);
        planes.classed("active", false);
        planes.classed("fadeout", false);
        planes.classed("half-active", false);
        points.classed("fadeout", false);
        points.classed("active", false);
        points.classed("half-active", false);
      });
    }

    function addEdgesHighlight(points, links) {
      points.on("mouseover", function (e, d) {
        if (isDragging) {
          return;
        }

        // fade out all other nodes, highlight a little connected ones
        points.classed("fadeout", true);

        points
          .filter((p) => {
            return (
              p !== d &&
              d[symbols.edgeSym].some(
                (edge) =>
                  edge[symbols.sourceNodeSym] === p ||
                  edge[symbols.targetNodeSym] === p
              )
            );
          })
          .classed("half-active", true)
          .classed("fadeout", false);

        // highlight current node
        select(this).classed("active", true).classed("fadeout", false);
        const edgeIdsOnThisNode = d[symbols.edgeSym].map(
          (edge) => edge[symbols.idSym]
        );

        // fadeout not connected edges, highlight connected ones
        links
          .classed(
            "fadeout",
            (p) => !edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          )
          .classed("active", (p) =>
            edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          );
      });

      points.on("mouseleave", function () {
        if (isDragging) {
          return;
        }
        links
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
        points
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
      });
    }

    init();

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
	"@id": "layered-graph",
	"stanza:label": "Layered graph",
	"stanza:definition": "3D Layered graph MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2022-04-01",
	"stanza:updated": "2022-11-02",
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
		"stanza:key": "misc-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(scss file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "group_planes-sort-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Sort group planes by this data key value"
	},
	{
		"stanza:key": "group_planes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Group planes sorting order"
	},
	{
		"stanza:key": "nodes-sort-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Sort nodes by this data key value"
	},
	{
		"stanza:key": "nodes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Nodes sorting order"
	},
	{
		"stanza:key": "node-size-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set size on the node based on data key"
	},
	{
		"stanza:key": "node-size-min",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Minimum node radius in px"
	},
	{
		"stanza:key": "node-size-max",
		"stanza:type": "number",
		"stanza:example": 6,
		"stanza:description": "Maximum node radius in px"
	},
	{
		"stanza:key": "node-size-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"sqrt",
			"log10"
		],
		"stanza:example": "sqrt",
		"stanza:description": "Node size scale"
	},
	{
		"stanza:key": "node-color-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set color of the node based on data key"
	},
	{
		"stanza:key": "edge-width-key",
		"stanza:type": "string",
		"stanza:example": "value",
		"stanza:description": "Set width of the edge  data key"
	},
	{
		"stanza:key": "edge-width-min",
		"stanza:type": "number",
		"stanza:example": 0.5,
		"stanza:description": "Minimum edge width in px"
	},
	{
		"stanza:key": "edge-width-max",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Maximum edge width in px"
	},
	{
		"stanza:key": "edge-width-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"sqrt",
			"log10"
		],
		"stanza:example": "linear",
		"stanza:description": "Edge width scale"
	},
	{
		"stanza:key": "edge-show_arrows",
		"stanza:type": "boolean",
		"stanza:example": "true",
		"stanza:description": "Show arrows"
	},
	{
		"stanza:key": "group_planes-constant_radius",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Constant radius for all groups"
	},
	{
		"stanza:key": "highlight-group_planes",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Highlight group planes on mouse hover"
	},
	{
		"stanza:key": "tooltips-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node tooltips data key. If empty, no tooltips will be shown"
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
		"stanza:key": "--togostanza-outline-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 1000,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "text",
		"stanza:default": "50",
		"stanza:description": "Inner padding in px"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Nodes border width"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": 0,
		"stanza:description": "Nodes border color"
	},
	{
		"stanza:key": "--togostanza-edge-color",
		"stanza:type": "color",
		"stanza:default": "#bdbdbd",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-group_plane-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Egdes default color"
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
    return "<div id=\"layered-graph\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=layered-graph.js.map
