import getStanzaColors from "@/lib/ColorGenerator";
import { LayeredGraphDataModel } from "@/lib/GraphDataSchema";
import prepareGraphData, {
  get3DEdges,
  getGroupPlanes,
} from "@/lib/prepareGraphData";
import ToolTip from "@/lib/ToolTip";
import * as d3 from "d3";
import { _3d } from "d3-3d";
import {
  appendCustomCss,
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadPngMenuItem,
  downloadSvgMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";
import loadData from "togostanza-utils/load-data";
import { handleApiError } from "../../lib/apiError";
import MetaStanza from "../../lib/MetaStanza";
import {
  emitSelectedEvent,
  toggleSelectIds,
  updateSelectedElementClassNameForD3,
} from "../../lib/utils";
import { curvedLink, straightLink } from "./curvedLink";

export default class ForceGraph extends MetaStanza {
  _graphArea;
  selectedEventParams = {
    targetElementSelector: ".node-g._3d",
    selectedElementClassName: "-selected",
    selectedElementSelector: ".-selected",
    idPath: "id",
  };
  selectedIds = [];

  menu() {
    return [
      downloadSvgMenuItem(this, "graph-3d-circle"),
      downloadPngMenuItem(this, "graph-3d-circle"),
      downloadJSONMenuItem(this, "graph-3d-circle", this._data),
      downloadCSVMenuItem(this, "graph-3d-circle", this._data),
      downloadTSVMenuItem(this, "graph-3d-circle", this._data),
    ];
  }

  async renderNext() {
    if (!this._graphArea?.empty()) {
      this._graphArea?.remove();
    }

    appendCustomCss(this, this.params["togostanza-custom_css_url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const setFallbackNumVal = (value, defVal) => {
      return isNaN(parseFloat(value)) ? defVal : parseFloat(value);
    };

    //data

    const width = setFallbackNumVal(css("--togostanza-canvas-width"), 200);
    const height = setFallbackNumVal(css("--togostanza-canvas-height"), 200);
    const MARGIN = getMarginsFromCSSString(css("--togostanza-canvas-padding"));

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const el = this.root.getElementById("layered-graph");

    const drawContent = async () => {
      const values = LayeredGraphDataModel.parse(
        await loadData(
          this.params["data-url"],
          this.params["data-type"],
          this.root.querySelector("main")
        )
      );

      this._data = values;

      const nodes = values.nodes;
      const edges = values.links;

      const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
      const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

      // Setting color scale
      const togostanzaColors = getStanzaColors(this);

      const color = function (type = "scaleOrdinal") {
        return d3[type]().range(togostanzaColors);
      };

      const svg = d3
        .select(el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const constRarius = false;

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

      const nodeLabelParams = {
        margin: 3,
        dataKey: this.params["node-label_key"],
      };

      const edgeWidthParams = {
        dataKey: this.params["edge-width-key"] || "",
        minWidth: setFallbackNumVal(this.params["edge-width-min"], 1),
        maxWidth: this.params["edge-width-max"],
        scale: this.params["edge-width-scale"] || "linear",
        showArrows: this.params["data-directed_graph"],
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
      const highlightGroupPlanes = true;

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
        nodeLabelParams,
      };

      const { prepNodes, prepEdges, groupHash, symbols } = prepareGraphData(
        nodes,
        edges,
        params
      );
      const sortedGroupHash = new Map(
        [...groupHash.entries()].sort(([a], [b]) => Number(a) - Number(b))
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
          .attr("d", d3.line()(arrowPoints))
          .attr("stroke", "none")
          .attr("style", (d) =>
            d[symbols.edgeColorSym] ? `fill: ${d[symbols.edgeColorSym]}` : null
          )
          .attr("fill-opacity", 1);
      }

      const maxNodesInGroup = d3.max([...groupHash.values()], (d) => d.length);

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
          d3
            .drag()
            .on("drag", dragged)
            .on("start", dragStart)
            .on("end", dragEnd)
        )
        .append("g");

      this._graphArea = svgG;

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

        const points = svgG.selectAll("g.node-g").data(data[0], key);

        points
          .enter()
          .append("g")
          .classed("node-g", true)
          .call(addNode)
          .merge(points)
          .classed("_3d", true)
          .attr(
            "transform",
            (d) => `translate(${posPointX(d)}, ${posPointY(d)})`
          );

        function addNode(nodeGroup) {
          nodeGroup
            .append("circle")
            .classed("node", true)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", (d) => d[symbols.nodeSizeSym])
            .style("fill", (d) => d[symbols.nodeColorSym]);

          nodeGroup
            .append("text")
            .classed("node-label", true)
            .text((d) => d[symbols.nodeLabelSym] || "")
            .attr("alignment-baseline", "hanging")
            .attr("text-anchor", "middle")
            .attr("y", (d) => d[symbols.nodeSizeSym] + 2);
        }

        points.sort(point3d.sort);

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

        const sortedGroupKeys = [...sortedGroupHash.keys()];
        // Laying out nodes=========
        const DEPTH = HEIGHT;
        const yPointScale = d3
          .scalePoint([-DEPTH / 2, DEPTH / 2])
          .domain(sortedGroupKeys);

        sortedGroupHash.forEach((group, gKey) => {
          // Laying out nodes ===

          const angleScale = d3
            .scalePoint()
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
          Object.fromEntries(sortedGroupHash.entries()),
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
        const points = svgG.selectAll("g.node-g");
        const links = svgG.selectAll("path.link");

        if (highlightGroupPlanes) {
          addPlanesHighlight(planes, points, links);
        }

        if (highlightAdjEdges) {
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

          d3.select(this).classed("active", true).classed("fadeout", false);

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
            .classed("dashed", true)
            .attr("stroke-dasharray", (d) =>
              Math.max(d.edge[symbols.edgeWidthSym] * 2, 2)
            );

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
          links.attr("stroke-dasharray", null);
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

          const group = sortedGroupHash.get("" + d.group);

          const nodesIdsInGroup = group.map((node) => node.id);

          const directlyConnectedNodes = d[symbols.edgeSym]
            .map((edge) => [
              edge[symbols.sourceNodeSym].id,
              edge[symbols.targetNodeSym].id,
            ])
            .flat()
            .filter((nodeId) => nodeId !== d.id);

          const directlyConnectedNodesSameGroup = directlyConnectedNodes.filter(
            (d) => nodesIdsInGroup.includes(d)
          );

          const connectedEdges = d[symbols.edgeSym];

          const edgesToSameGroupNodes = connectedEdges.filter(
            (edge) =>
              directlyConnectedNodesSameGroup.includes(
                edge[symbols.sourceNodeSym].id
              ) ||
              directlyConnectedNodesSameGroup.includes(
                edge[symbols.targetNodeSym].id
              )
          );

          const edgesToOtherGroupNodes = connectedEdges.filter((edge) => {
            return (
              !directlyConnectedNodesSameGroup.includes(
                edge[symbols.sourceNodeSym].id
              ) &&
              !directlyConnectedNodesSameGroup.includes(
                edge[symbols.targetNodeSym].id
              )
            );
          });

          // fade out all other nodes, highlight a little connected ones
          points.classed("fadeout", true);

          points
            .filter((p) => p !== d && directlyConnectedNodes.includes(p.id))
            .classed("half-active", true)
            .classed("fadeout", false);

          // highlight current node
          d3.select(this).classed("active", true).classed("fadeout", false);

          // fadeout not connected edges, highlight connected ones

          links
            .classed("fadeout", true)
            .classed("active", false)
            .classed("half-active", false)
            .classed("dashed", false);

          links
            .filter(({ edge }) =>
              edgesToOtherGroupNodes.some(
                (e) => e[symbols.idSym] === edge[symbols.idSym]
              )
            )
            .classed("fadeout", false)
            .classed("half-active", true)
            .attr("stroke-dasharray", (d) =>
              Math.max(d.edge[symbols.edgeWidthSym] * 2, 2)
            );

          links
            .filter(({ edge }) =>
              edgesToSameGroupNodes.some(
                (e) => e[symbols.idSym] === edge[symbols.idSym]
              )
            )
            .classed("fadeout", false)
            .classed("active", true);
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
        const points = svgG.selectAll("circle.node");
        points.attr("data-tooltip", (d) => {
          return d[tooltipParams.dataKey];
        });
      }

      const nodeGroups = this._graphArea.selectAll("circle.node");
      nodeGroups.on("click", (_, d) => {
        toggleSelectIds({
          selectedIds: this.selectedIds,
          targetId: d.id,
        });
        updateSelectedElementClassNameForD3({
          drawing: this._graphArea,
          selectedIds: this.selectedIds,
          ...this.selectedEventParams,
        });
        if (this.params["event-outgoing_change_selected_nodes"]) {
          emitSelectedEvent({
            rootElement: this.element,
            targetId: d.id,
            selectedIds: this.selectedIds,
            dataUrl: this.params["data-url"],
          });
        }
      });
    };

    handleApiError({
      stanzaData: this,
      hasTooltip: true,
      drawContent,
    });
  }

  handleEvent(event) {
    const { selectedIds, dataUrl } = event.detail;

    if (
      this.params["event-incoming_change_selected_nodes"] &&
      dataUrl === this.params["data-url"]
    ) {
      this.selectedIds = selectedIds;
      updateSelectedElementClassNameForD3({
        drawing: this._graphArea,
        selectedIds,
        ...this.selectedEventParams,
      });
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
    default:
      break;
  }

  return res;
}
