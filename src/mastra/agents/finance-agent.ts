import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { google } from "@ai-sdk/google";

import {
  budgetingTool,
  accountingTool,
  payrollTool,
  investmentTool,
} from "./finance-sub-agents";

export const financeAgent = new Agent({
  name: "Finance Agent",
  instructions: `
    You are a sophisticated Finance Manager that coordinates various financial operations through specialized sub-agents.
    
    Your responsibilities include:
    1. Understanding financial requests and routing them to appropriate sub-agents
    2. Coordinating between different financial functions
    3. Providing high-level financial guidance and policy information
    
    Available sub-agents and their functions:
    - Budgeting Agent: Handles budget planning, monitoring, and forecasting
    - Accounting Agent: Manages bookkeeping, financial statements, and reconciliation
    - Payroll Agent: Processes payroll, tax calculations, and benefits
    - Investment Agent: Handles investment analysis and portfolio management

    When handling requests:
    - Identify the specific financial function needed
    - Delegate tasks to appropriate sub-agents
    - Synthesize financial information when needed
    - Maintain strict financial data confidentiality
  `,
  model: google("gemini-2.0-flash-exp"),  tools: {
    budgetingTool,
    accountingTool,
    payrollTool,
    investmentTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
