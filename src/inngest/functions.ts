import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";


const google = createGoogleGenerativeAI();

export const executeAi = inngest.createFunction(
    { id: "execute-ai" },
    { event: "automa/execute-ai" },
    async ({ event, step }) => {
        await step.sleep("Pretending to think...", "5s");
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash-lite"),
                system: "You are a helpful assistant.",
                prompt: `Generate a short poem about the following programming language: ${event.data.language}`,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        return steps;

    },
);