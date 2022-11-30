import * as d3 from "d3";

export function drawChordDiagram(svg, nodes, edges, { symbols, ...params }) {
  const names = nodes.map((node) => node[params.labelsParams.dataKey]);

  const matrix = (() => {
    const index = new Map(names.map((name, i) => [name, i]));
    const matrix = Array.from(index, () => new Array(names.length).fill(0));
    for (const edge of edges) {
      matrix[index.get(edge.source)][index.get(edge.target)] +=
        edge[symbols.edgeWidthSym];
    }
    return matrix;
  })();

  const WIDTH = params.width - params.MARGIN.LEFT - params.MARGIN.RIGHT;
  const HEIGHT = params.height - params.MARGIN.TOP - params.MARGIN.BOTTOM;

  const innerRadius = Math.min(WIDTH, HEIGHT) * 0.5 - 20;
  const outerRadius = innerRadius + 6;

  // get Letter height

  const arcsGap = 7;
  const edgeOffset = 5;
  const labelOffset = 5;
  const labelRadius = outerRadius + labelOffset;

  const ribbon = d3
    .ribbonArrow()
    .radius(innerRadius - edgeOffset)
    .padAngle(1 / innerRadius);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const chord = d3
    .chordDirected()
    .padAngle(arcsGap / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  const chords = chord(matrix);

  const edgeColorScale = params.color();

  chords.groups.forEach((node) => {
    node.color = edgeColorScale("" + node.index);
    node.tooltip = nodes[node.index][params.tooltipParams.dataKey];
    node.label = nodes[node.index][params.labelsParams.dataKey];
  });

  const fullsircleId = `fullsircle${new Date().getTime()}`;

  const rootGroup = svg
    .append("g")
    .attr(
      "transform",
      `translate(${[params.width * 0.5, params.height * 0.5]})`
    );

  rootGroup
    .append("path")
    .classed("fullsircle", true)
    .attr("id", fullsircleId)
    .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

  rootGroup
    .append("g")
    .classed("ribbons", true)
    .selectAll("g")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", (d) => chords.groups[d.source.index].color);
  const arcsG = rootGroup
    .append("g")
    .classed("arcs", true)
    .selectAll("g")
    .data(chords.groups)
    .join("g");

  const arcs = arcsG
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => d.color);

  if (params.tooltipParams.show) {
    arcs.attr("data-tooltip", (d) => d.tooltip);
  }

  arcsG.call((g) =>
    g
      .append("g")
      .attr("transform", (d) => {
        let da = 0;
        const angle = (((d.endAngle + d.startAngle) / 2) * 180) / Math.PI - 90;
        if (angle <= -90 || angle >= 90) {
          da = 180;
        }

        return `
          rotate(${
            (((d.endAngle + d.startAngle) / 2) * 180) / Math.PI - 90 + da
          })`;
      })
      .append("text")
      .attr("class", "label")
      .text((d) => d.label)
      .attr("alignment-baseline", "middle")
      .attr("x", (d) => {
        const angle = (((d.endAngle + d.startAngle) / 2) * 180) / Math.PI - 90;
        if (angle <= -90 || angle >= 90) {
          return -labelRadius;
        }
        return labelRadius;
      })
      .attr("text-anchor", (d) => {
        const angle = (((d.endAngle + d.startAngle) / 2) * 180) / Math.PI - 90;
        if (angle > -90 && angle < 90) {
          return "start";
        }
        return "end";
      })
  );
}
