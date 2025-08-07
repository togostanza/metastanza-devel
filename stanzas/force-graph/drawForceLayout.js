import * as d3 from "d3";
import { addHighlightOnHover } from "../../lib/graphHighlight";

function straightLink(d) {
  const start = { x: d.source.x, y: d.source.y };
  const end = { x: d.target.x, y: d.target.y };
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
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
            S ${p1.x} ${p1.y} ${end.x} ${end.y}`;
}

export default function (
  svg,
  nodes,
  edges,
  {
    width,
    height,
    MARGIN,
    nodeLabelParams,
    tooltipParams,
    highlightAdjEdges,
    edgeWidthParams,
    nodeColorParams,
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
      .attr("d", d3.line()(arrowPoints))
      .attr("stroke", "none")
      .attr("style", (d) =>
        d[symbols.edgeColorSym] ? `fill: ${d[symbols.edgeColorSym]}` : null
      )
      .attr("fill-opacity", 1);
  }

  const forceG = svg
    .append("g")
    .attr("id", "forceG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
    .attr(
      "class",
      nodeColorParams.colorBlendMode === "multiply"
        ? "-nodes-blend-multiply"
        : nodeColorParams.colorBlendMode === "screen"
        ? "-nodes-blend-screen"
        : ""
    );

  const gLinks = forceG.append("g").attr("class", "links");
  const gNodes = forceG.append("g").attr("class", "nodes");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
    .force(
      "link",
      d3
        .forceLink()
        .links(edges)
        .id((d) => d.id)
        .distance(50)
        .strength(0.5)
    )
    .force(
      "collide",
      d3
        .forceCollide()
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
    .attr("class", "node")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`;
    })
    .call(drag(simulation));

  const nodeCircles = nodeGroups
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => d[symbols.nodeSizeSym])
    .attr("fill", (d) => {
      return d[symbols.nodeColorSym];
    });

  if (tooltipParams.show && tooltipParams.tooltipsInstance) {
    nodeCircles.attr("data-tooltip", (d) =>
      tooltipParams.tooltipsInstance.compile(d)
    );
  }

  if (nodeLabelParams.dataKey !== "" && nodes[0][nodeLabelParams.dataKey]) {
    nodeGroups.each(function (d) {
      d3.select(this)
        .append("text")
        .attr("x", 0)
        .attr("dy", (d) => nodeLabelParams.margin + d[symbols.nodeSizeSym])
        .attr("class", "label")
        .attr("alignment-baseline", "hanging")
        .attr("text-anchor", "middle")
        .text(d[symbols.nodeLabelSym]);
    });
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }

      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  if (highlightAdjEdges) {
    addHighlightOnHover(symbols, nodes, nodeGroups, links);
  }
}
