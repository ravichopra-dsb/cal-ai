import { google } from "googleapis";
import type {
  checkSlotAvailabilityToolParams,
  createEventToolParams,
  listEventsToolParams,
} from "./types.js";

// Constants
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendar = google.calendar("v3");

// Type Definitions
type Auth = Awaited<ReturnType<typeof authenticate>>;

const calendarId = process.env.CALENDAR_ID;

// Authentication Function
export async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: SCOPES,
  });
  return await auth.getClient();
}

// Function to list events
export async function listEvents(params: listEventsToolParams) {
  const auth = await authenticate();
  const res = await calendar.events.list({
    auth,
    calendarId: calendarId,
    timeMin: new Date().toISOString(),
    maxResults: params.maxResults || 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items;
  if (!events || events.length === 0) {
    return "No upcoming events found.";
  }

  return events.map((event) => ({
    start: event.start.dateTime || event.start.date,
    summary: event.summary,
  }));
}

// Event Creation Data
const event = {
  summary: "Google I/O 2015",
  location: "800 Howard St., San Francisco, CA 94103",
  description: "A chance to hear more about Google's developer products.",
  start: {
    dateTime: "2025-01-28T09:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2025-01-28T17:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

export async function createEvent(params: createEventToolParams) {
  const auth = await authenticate();
  const event = {
    summary: params.summary,
    location: params.location,
    description: params.description,
    start: {
      dateTime: params.startTime,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: params.endTime,
      timeZone: "America/Los_Angeles",
    },
  };

  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: calendarId,
      resource: event,
    });

    return `Event created: ${response.data.htmlLink}`;
  } catch (err) {
    console.error("Error creating event:", err);
    return "There was an error creating the event.";
  }
}

// Function to check slot availability
export async function checkSlotAvailability(params: checkSlotAvailabilityToolParams) {
  const auth = await authenticate();
  const response = await calendar.events.list({
    auth,
    calendarId: calendarId,
    timeMin: params.startTime,
    timeMax: params.endTime,
    singleEvents: true,
  });

  const events = response.data.items;

  return !events || events.length === 0; // Return true if no events found, meaning the slot is available
}

// #NOTE : these are for testing purposes

// Main Function to Execute Tasks
export async function main() {
  try {
    await listEvents({ maxResults: 10 });
    // Uncomment to create an event
    // await createEvent(auth);
  } catch (error) {
    console.error(error);
  }
}

// Function to Create Google Event
export async function createGoogleEvent() {
  await createEvent({
    summary: "Google I/O 2015",
    description: "A chance to hear more about Google's developer products.",
    location: "800 Howard St., San Francisco, CA 94103",
    startTime: "2025-01-28T09:00:00-07:00",
    endTime: "2025-01-28T17:00:00-07:00",
  });
}

// Uncomment to run the main function
// main().catch(console.error);
