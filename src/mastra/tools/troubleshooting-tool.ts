import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { searchGoogle } from "./search-google-tool";
import { troubleshootingAgent } from "../agents/it-sub-agents";

export const troubleshootingTool = createTool({
  id: "troubleshooting-tool",
    description:
        "A tool for managing and providing basic troubleshooting assistance. Uses Google search to find solutions online.",
     inputSchema: z.object({
      query: z.string().describe("The query or task to troubleshoot"),
      parameters: z
        .record(z.any())
        .optional()
        .describe("Additional parameters for the task"),
    }),
    outputSchema: z.object({
      results: z.array(z.record(z.string(), z.any())), // Flexible: each result can have any shape
      raw: z.any().optional(), // Optionally include the raw response
      type: z.string().optional(),
    }),
        execute: async ({ context }) => {
      try {
        const result = await searchGoogle({
          toolInput: {
            query: context.query,
            n_results: context.n_results || 5,
          },
        });
        let output = result.output?.[0] || result.output;
        let results: any[] = [];
        // If output.value exists and is a string, try to parse it as JSON
        if (output && typeof output.value === "string") {
          try {
            const parsed = JSON.parse(output.value);
            if (Array.isArray(parsed)) {
              const agentResponse = await troubleshootingAgent.generate(
                `Based on the following Google search results, provide troubleshooting steps or advice:\n${JSON.stringify(parsed, null, 2)}`
              );
              results = [{ response: agentResponse.text }];
            } else if (parsed && Array.isArray(parsed.results)) {
              const agentResponse = await troubleshootingAgent.generate(
                `Based on the following Google search results, provide troubleshooting steps or advice:\n${JSON.stringify(parsed.results, null, 2)}`
              );
              results = [{ response: agentResponse.text }];
            }
          } catch (e) {
            console.warn("Failed to parse output.value as JSON:", e);
          }
        } else if (output && Array.isArray(output.results)) {
          const agentResponse = await troubleshootingAgent.generate(
            `Based on the following Google search results, provide troubleshooting steps or advice:\n${JSON.stringify(output.results, null, 2)}`
          );
          results = [{ response: agentResponse.text }];
        }
        return { results, raw: output };
      } catch (error) {
        console.error("Google search failed:", error);
        return { results: [] };
      }
    },
})