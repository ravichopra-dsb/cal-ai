import { tool } from "ai";
import { z } from "zod";
import { checkSlotAvailability, createEvent, listEvents } from "./functions.js";

// Tool to list events
export const listEventsTool = tool({
  description: "List upcoming events from the primary calendar",
  parameters: z.object({
    maxResults: z
      .number()
      .optional()
      .describe("Maximum number of events to return"),
  }),
  execute: async ({ maxResults }): Promise<{ events: any[] }> => {
    const events = await listEvents({ maxResults });
    return {
      message: "List of events",
      events: events,
    };
  },
});

// Tool to create an event
export const createEventTool = tool({
  description: "Create a new event in the primary calendar",
  parameters: z.object({
    summary: z.string().describe("Event summary"),
    location: z.string().optional().describe("Event location"),
    description: z.string().optional().describe("Event description"),
    startTime: z.string().describe("Event start time in ISO format"),
    endTime: z.string().describe("Event end time in ISO format"),
  }),
  execute: async ({
    summary,
    location,
    description,
    startTime,
    endTime,
  }): Promise<string> => {
    return await createEvent({
      summary,
      location,
      description,
      startTime,
      endTime,
    });
  },
});

// Tool to check slot availability
export const checkSlotAvailabilityTool = tool({
  description: "Check if a time slot is available in the primary calendar",
  parameters: z.object({
    startTime: z
      .string()
      .describe("Start time for checking availability in ISO format"),
    endTime: z
      .string()
      .describe("End time for checking availability in ISO format"),
  }),
  execute: async ({ startTime, endTime }): Promise<boolean> => {
    return await checkSlotAvailability({ startTime, endTime });
  },
});

export const getCurrentDateTool = tool({
  parameters: z.object({}),
  description: "Get the current date in the format YYYY-MM-DD",
  execute: async (): Promise<string> => {
    return getCurrentDate();
  },
});

export const getCurrentDate = () => {
  // gets the current date in the below format
  // 2025-01-28T09:00:00-07:00
  const date = new Date();
  const formattedDate = date.toISOString();
  return formattedDate;
};
