import { z } from "zod";

import type {
  checkSlotAvailabilityTool,
  createEventTool,
  listEventsTool,
} from "./tools.js";

export type checkSlotAvailabilityToolParams = z.infer<
  typeof checkSlotAvailabilityTool.parameters
>;
export type createEventToolParams = z.infer<typeof createEventTool.parameters>;
export type listEventsToolParams = z.infer<typeof listEventsTool.parameters>;
