import * as dotenv from "dotenv";
dotenv.config();

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { embed } from "ai";
import { cohere } from "@ai-sdk/cohere";

export const basicSearchTool = createTool({
  id: "basic-search",
  description: "Simple vector search across document",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    limit: z.number().default(5).describe("number of results to return"),
  }),
  execute: async ({ context: { query, limit }, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra instance not found in context");
    }

    const vectorStore = mastra?.getVector("mongodb");
    if (!vectorStore) {
      throw new Error("MongoDB vector store not found");
    }

    const { embedding } = await embed({
      model: cohere.embedding("embed-v4.0"),
      value: query,
    });

    const results = await vectorStore.query({
      indexName: "lambe-profile",
      queryVector: embedding,
      topK: limit,
    });

    return results;
  },
});
