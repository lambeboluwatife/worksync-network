import Arcade from "@arcadeai/arcadejs";

const USER_ID = process.env.USER_ID;

export const searchGoogle = async ({ toolInput }) => {
  const client = new Arcade();

  const result = await client.tools.execute({
    tool_name: "GoogleSearch.Search@3.0.0",
    input: {
      owner: "ArcadeAI",
      name: "arcade-ai",
      starred: "true",
      query: toolInput.query,
      n_results: toolInput.n_results || 5,
    },
    user_id: USER_ID,
  });

  return result;
};

// export const searchGoogleTool = createTool({
//   id: "search-google",
//   description: `Searches Google for the specified query and returns results.`,
//   inputSchema: z.object({
//     query: z.string().describe("The search query to perform on Google"),
//     n_results: z
//       .number()
//       .optional()
//       .default(5)
//       .describe("Number of results to return"),
//   }),
//   outputSchema: z.object({
//     results: z.array(z.record(z.string(), z.any())), // Flexible: each result can have any shape
//     raw: z.any().optional(), // Optionally include the raw response
//     type: z.string().optional(), // Optionally include a type for context
//   }),
//   execute: async ({ context }) => {
//     try {
//       const result = await searchGoogle({
//         toolInput: {
//           query: context.query,
//           n_results: context.n_results || 5,
//         },
//       });
//       // Adjust to match the actual structure of the result
//       let output = result.output?.[0] || result.output;
//       let results: any[] = [];
//       // If output.value exists and is a string, try to parse it as JSON
//       if (output && typeof output.value === "string") {
//         try {
//           const parsed = JSON.parse(output.value);
//           if (Array.isArray(parsed)) {
//             results = parsed;
//           } else if (parsed && Array.isArray(parsed.results)) {
//             results = parsed.results;
//           }
//         } catch (e) {
//           console.warn("Failed to parse output.value as JSON:", e);
//         }
//       } else if (output && Array.isArray(output.results)) {
//         results = output.results;
//       }
//       console.log("Google search output:", output);
//       return { results, raw: output };
//     } catch (error) {
//       console.error("Google search failed:", error);
//       // Return an empty results array on error to match outputSchema
//       return { results: [] };
//     }
//   },
// });
