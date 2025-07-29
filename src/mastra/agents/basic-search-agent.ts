import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { basicSearchTool } from '../tools/basic-search-tool';

export const basicSearchAgent = new Agent({
  name: 'Basic Search Agent',
  description: 'An agent that can help explore and understand documents using RAG.',
  instructions: 'Use your tools and knowledge to help users explore and understand documents.',
  model: google('gemini-2.0-flash-exp'),
  tools: { basicSearchTool },
  // memory: new Memory({
  //   storage: new LibSQLStore({
  //     url: 'file:../mastra.db', // path is relative to the .mastra/output directory
  //   }),
  // }),
});