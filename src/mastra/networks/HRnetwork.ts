import { NewAgentNetwork } from "@mastra/core/network/vNext";
import { google } from "@ai-sdk/google";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { mastra } from "../index";

import {
  PTOAgent,
  adminAgent,
  performanceAgent,
  trainingAgent,
  onboardingAgent,
  recruitmentAgent,
} from "../agents/hr-agents";
import { hrRAGAgent } from "../rag/ragAgents";

const memory = new Memory({
  storage: new LibSQLStore({
    // url: 'file:../mastra.db', // Or your database URL
    url: ":memory:",
  }),
});

export const worksyncNetwork = new NewAgentNetwork({
  id: "worksync-network",
  name: "WorkSync Network",
  instructions: `
    You are the central coordination network for WorkSync's intelligent HR agents.

    === Purpose ===
    Your role is to facilitate seamless communication, collaboration, and task delegation across a suite of specialized HR agents. These agents cover various domains including onboarding, training, performance management, recruitment, PTO processing, policy understanding, and administrative operations.

    === Responsibilities ===
    - Route tasks to the most appropriate sub-agent based on the domain of the request.
    - Support complex workflows that require input from multiple HR domains (e.g., onboarding + training).
    - Ensure context is preserved when information is exchanged across agents.
    - Provide accurate, efficient, and secure responses through coordinated agent collaboration.

    === Connected Agents ===
    - **PTOAgent**: Calculates and manages paid time off for employees.
    - **AdminAgent**: Handles employee records, account access, and general admin tasks.
    - **PerformanceAgent**: Oversees employee performance reviews and feedback processes.
    - **TrainingAgent**: Manages internal learning, training programs, and development tracking.
    - **OnboardingAgent**: Executes the onboarding process for new hires, including documentation, setup, and orientation.
    - **RecruitmentAgent**: Manages job postings, applicant tracking, and interview coordination.
    - **hrRAGAgent**: Performs semantic search and interpretation of HR policy documents using Retrieval-Augmented Generation (RAG).

    Always prioritize accuracy, security, and timely delegation of tasks across this network.
  `,
  model: google("gemini-2.0-flash-exp"),
  memory: memory,
  agents: {
    PTOAgent,
    adminAgent,
    performanceAgent,
    trainingAgent,
    onboardingAgent,
    recruitmentAgent,
    hrRAGAgent,
  },
});
