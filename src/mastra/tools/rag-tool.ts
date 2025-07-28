import * as dotenv from "dotenv";
dotenv.config();

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { embed } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { rerank } from "@mastra/rag";


export const hrRAGSearchTool = createTool({
  id: "hr-policy-search",
  description: "Performs semantic search over HR policy documents using vector embeddings and reranking.",
  inputSchema: z.object({
    query: z.string().describe("The HR-related query to search across policy documents (e.g., 'maternity leave duration')"),
    limit: z.number().default(5).describe("Maximum number of top results to return from the search"),
  }),
  execute: async ({ context: {query, limit}, mastra }) => {

    console.log("Checking mastra object:", mastra);
    const vectorStore = mastra?.getVector("mongodb");
    console.log("Checking vectorStore object:", vectorStore);

    if (!vectorStore) {
      throw new Error("MongoDB vector store is not available or was not initialized.");
    }

    try {
      // Generate embedding for the query
      const { embedding } = await embed({
        model: cohere.embedding("embed-v4.0"),
        value: query,
      });

      // Perform vector search
      const results = await vectorStore.query({
        indexName: "hrPolicy",
        queryVector: embedding,
        topK: limit,
      });

      // Check if we have results before reranking
      if (!results || results.length === 0) {
        return {
          results: [],
          message: "No relevant documents found for the query."
        };
      }

      // Rerank the results
      const rerankedResults = await rerank(
        results,
        query,
        cohere("rerank-v3.5"),
        {
          topK: Math.min(3, results.length),
        }
      );

      return {
        results: rerankedResults,
        totalFound: results.length,
        query: query
      };

    } catch (error: any) {
      console.error("Error in HR RAG search:", error);
      throw new Error(`Failed to perform HR policy search: ${error.message}`);
    }
  },
});



// export const queryVectorTool = createVectorQueryTool({
//     id: "query-vector",
//     vectorStoreName: "mongodb",
//     indexName: "hrPolicy",
//     model: cohere.embedding("embed-english-v3.0"),
//     enableFilter: true,
//     reranker: {
//         model: cohere("rerank-v3.5"),
//         options: {
//             topK: 5
//         }
//     }
// })