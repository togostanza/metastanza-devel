import z from "zod";

export const GroupingSchema = z
  .object({
    "grouping-key": z.string().optional(),
    "grouping-arrangement": z.string().optional(),
  })
  .passthrough();

export type GroupingParamsT = z.infer<typeof GroupingSchema>;
