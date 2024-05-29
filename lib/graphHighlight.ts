import { select } from "d3";

type Node = { id: string | number; [s: symbol]: Edge[] };

type Edge = {
  id: string | number;
  [s: symbol]: Node;
};

type Symbols = {
  sourceNodeSym: symbol;

  targetNodeSym: symbol;

  edgeSym: symbol;
};

export function addHighlightOnHover(
  symbols: Symbols,
  nodes: Node[],
  nodesSelection: d3.Selection<SVGGElement, Node, SVGGElement, unknown>,
  linksSelection: d3.Selection<SVGPathElement, Edge, SVGGElement, unknown>
) {
  nodesSelection.on("mouseover", function (e, d) {
    select(this).classed("-active", true);
    const node = nodes.find((n) => n.id === d.id);
    const connectedEdges = node[symbols.edgeSym];

    const connectedNodesIds = new Set(
      connectedEdges
        .map((edge) => [
          edge[symbols.sourceNodeSym].id,
          edge[symbols.targetNodeSym].id,
        ])
        .flat()
    );

    nodesSelection
      .classed("-fadeout", (p) => d !== p && !connectedNodesIds.has(p.id))
      .classed("-half-active", (p) => {
        return p !== d && connectedNodesIds.has(p.id);
      });
    linksSelection
      .classed(
        "-fadeout",
        (p) =>
          p[symbols.sourceNodeSym].id !== d.id &&
          p[symbols.targetNodeSym].id !== d.id
      )
      .classed("-active", (p) => {
        return (
          p[symbols.sourceNodeSym].id === d.id ||
          p[symbols.targetNodeSym].id === d.id
        );
      });
  });

  nodesSelection.on("mouseleave", function () {
    linksSelection
      .classed("-active", false)
      .classed("-fadeout", false)
      .classed("-half-active", false);
    nodesSelection
      .classed("-active", false)
      .classed("-fadeout", false)
      .classed("-half-active", false);
  });
}
