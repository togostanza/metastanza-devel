import { z } from "zod";

const NodesListModel = z
  .object({
    id: z.union([z.number(), z.string()], {
      required_error: "key `id` is required",
    }),
  })
  .passthrough();

const LayeredGraphNodesListModel = NodesListModel.extend({
  group: z.union([z.number(), z.string()], {
    required_error: "key `group` is required",
  }),
});

const EdgesListModel = z
  .object({
    source: z.union([z.number(), z.string()]),
    target: z.union([z.number(), z.string()]),
  })
  .passthrough();

export const GraphDataModel = z
  .object({
    nodes: z.array(NodesListModel, {
      required_error: "key `nodes` is required",
      description: "Nodes array",
    }),
    links: z.array(EdgesListModel, {
      required_error: "key `links` is required",
      description: "Links (edges) array",
    }),
  })
  .passthrough();

export const LayeredGraphDataModel = GraphDataModel.extend({
  nodes: z.array(LayeredGraphNodesListModel, {
    required_error: "key `nodes` is required",
    description: "Array of nodes with group information",
  }),
});
export const ChordDiagramModel = GraphDataModel.pick({
  links: true,
}).passthrough();

export type GraphDataT = z.infer<typeof GraphDataModel>;
export type LayeredGraphDataT = z.infer<typeof LayeredGraphDataModel>;
export type ChordDiagramDataT = z.infer<typeof ChordDiagramModel>;
