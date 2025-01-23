import { openai } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";
import {
    checkSlotAvailabilityTool,
    createEventTool,
    listEventsTool,
} from "./src/tools.js";

import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';

dotenv.config();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = openai("gpt-4-turbo");

const messages: CoreMessage[] = [];

const askAQuestion = async (prompt: string) => {
    const { textStream } = await streamText({
    model,
    prompt,
    maxSteps:4,
    messages,
    system:process.env.SYSTEM_PROMPT ||  "You are a helpful assistant.",
    tools: {
      listEventsTool,
      checkSlotAvailabilityTool,
      createEventTool,
    },
  });

  let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
};


async function main(){
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });
    askAQuestion(userInput);
  }
}
main().catch(console.error);