import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { google } from '@ai-sdk/google';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Budgeting Agent
export const budgetingAgent = new Agent({
  name: 'Budgeting Sub-Agent',
  instructions: `
    You are a specialized budgeting agent responsible for:
    - Creating budget plans
    - Monitoring expenses
    - Forecasting financials
    - Analyzing variances
  `,
  model: google('gemini-2.0-flash-exp'),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  }),
});

// Accounting Agent
export const accountingAgent = new Agent({
  name: 'Accounting Sub-Agent',
  instructions: `
    You are a specialized accounting agent responsible for:
    - Managing bookkeeping
    - Preparing financial statements
    - Handling reconciliations
    - Processing transactions
  `,
  model: google('gemini-2.0-flash-exp'),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  }),
});

// Payroll Agent
export const payrollAgent = new Agent({
  name: 'Payroll Sub-Agent',
  instructions: `
    You are a specialized payroll agent responsible for:
    - Processing payroll
    - Calculating taxes
    - Managing benefits
    - Handling deductions
  `,
  model: google('gemini-2.0-flash-exp'),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  }),
});

// Investment Agent
export const investmentAgent = new Agent({
  name: 'Investment Sub-Agent',
  instructions: `
    You are a specialized investment agent responsible for:
    - Analyzing investment opportunities
    - Managing portfolios
    - Monitoring market trends
    - Providing investment recommendations
  `,
  model: google('gemini-2.0-flash-exp'),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  }),
});

// Budgeting Tool
export const budgetingTool = createTool({
  id: 'budgeting-agent',
  description: 'Handles budget planning, monitoring, and forecasting tasks.',
  inputSchema: z.object({
    task: z.string().describe('The budgeting task to perform'),
    parameters: z.record(z.any()).optional().describe('Additional parameters for the task'),
  }),
  outputSchema: z.object({
    result: z.string().describe('Result of the budgeting operation'),
    data: z.record(z.any()).optional().describe('Any additional data from the operation'),
  }),  execute: async ({ context }) => {
    const result = await budgetingAgent.generate(
      `Handle the following budgeting task: ${context.task}`,
    );
    return { 
      result: result.text,
      data: context.parameters 
    };
  },
});

// Accounting Tool
export const accountingTool = createTool({
  id: 'accounting-agent',
  description: 'Handles bookkeeping, financial statements, and reconciliation tasks.',
  inputSchema: z.object({
    task: z.string().describe('The accounting task to perform'),
    parameters: z.record(z.any()).optional().describe('Additional parameters for the task'),
  }),
  outputSchema: z.object({
    result: z.string().describe('Result of the accounting operation'),
    data: z.record(z.any()).optional().describe('Any additional data from the operation'),
  }),
  execute: async ({ context }) => {
    const result = await accountingAgent.generate(
      `Handle the following accounting task: ${context.task}`,
    );
    return { result: result.text };
  },
});

// Payroll Tool
export const payrollTool = createTool({
  id: 'payroll-agent',
  description: 'Handles payroll processing, tax calculations, and benefits administration.',
  inputSchema: z.object({
    task: z.string().describe('The payroll task to perform'),
    parameters: z.record(z.any()).optional().describe('Additional parameters for the task'),
  }),
  outputSchema: z.object({
    result: z.string().describe('Result of the payroll operation'),
    data: z.record(z.any()).optional().describe('Any additional data from the operation'),
  }),
  execute: async ({ context }) => {
    const result = await payrollAgent.generate(
      `Handle the following payroll task: ${context.task}`,
    );
    return { result: result.text };
  },
});

// Investment Tool
export const investmentTool = createTool({
  id: 'investment-agent',
  description: 'Handles investment analysis and portfolio management tasks.',
  inputSchema: z.object({
    task: z.string().describe('The investment task to perform'),
    parameters: z.record(z.any()).optional().describe('Additional parameters for the task'),
  }),
  outputSchema: z.object({
    result: z.string().describe('Result of the investment operation'),
    data: z.record(z.any()).optional().describe('Any additional data from the operation'),
  }),
  execute: async ({ context }) => {
    const result = await investmentAgent.generate(
      `Handle the following investment task: ${context.task}`,
    );
    return { result: result.text };
  },
});
