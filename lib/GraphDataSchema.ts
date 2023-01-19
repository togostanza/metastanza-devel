import { z } from "zod";

// z
//   .object({
//     id: z.union([z.number(), z.string()],{required_error: "key `id` is required"}),
//     group: z.union([z.number(), z.string()], {required_error: "key `group` is required"}),
//   })
//   .passthrough();

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

const EgdesListModel = z
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
    links: z.array(EgdesListModel, {
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

export type GraphDataT = z.infer<typeof GraphDataModel>;
export type LayeredGraphDataT = z.infer<typeof LayeredGraphDataModel>;
