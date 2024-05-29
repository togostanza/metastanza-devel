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
  nodeGroups: d3.Selection<SVGGElement, Node, SVGGElement, unknown>,
  links: d3.Selection<SVGPathElement, Edge, SVGGElement, unknown>
) {
  nodeGroups.on("mouseover", function (e, d) {
    select(this).classed("-active", true);
    const node = nodes.find((n) => n.id === d.id);
    const connectedEdges = node[symbols.edgeSym];

    const connectedNodesIds = connectedEdges
      .map((edge) => [
        edge[symbols.sourceNodeSym].id,
        edge[symbols.targetNodeSym].id,
      ])
      .flat();

    console.log({ connectedNodesIds, d, symbols });

    nodeGroups
      .classed("-fadeout", (p) => d !== p && !connectedNodesIds.includes(p.id))
      .classed("-half-active", (p) => {
        return p !== d && connectedNodesIds.includes(p.id);
      });
    links
      .classed("-fadeout", (p) => !d[symbols.edgeSym].includes(p))
      .classed("-active", (p) => d[symbols.edgeSym].includes(p));
  });

  nodeGroups.on("mouseleave", function () {
    links
      .classed("-active", false)
      .classed("-fadeout", false)
      .classed("-half-active", false);
    nodeGroups
      .classed("-active", false)
      .classed("-fadeout", false)
      .classed("-half-active", false);
  });
}
