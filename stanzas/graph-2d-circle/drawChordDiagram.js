import * as d3 from "d3";

export function drawChordDiagram(svg, nodes, edges, { symbols, ...params }) {
  const names = nodes.map((node) => node.id);

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

  const arcsGap = 5;
  const edgeOffset = 5;

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
  chords.forEach((chord) => {
    chord.color = edgeColorScale("" + chord.target.index);
    chords.groups[chord.source.index].color = chord.color;
  });

  console.log(chords);

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
    .attr("fill", (d) => d.color);
  rootGroup
    .append("g")
    .classed("arcs", true)
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call((g) =>
      g
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => d.color)
        .attr("stroke", "#fff")
    )
    .call((g) =>
      g
        .append("text")
        .attr("dy", -3)
        .append("textPath")
        // .attr('xlink:href', textId.href)
        .attr("xlink:href", () => `#${fullsircleId}`)
        .attr("startOffset", (d) => d.startAngle * outerRadius)
        .text((d) => names[d.index])
    );
}
