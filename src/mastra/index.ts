import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { worksyncNetwork } from "./networks/HRnetwork";
import { MongoDBVector } from "@mastra/mongodb";
import { hrAgent } from "./agents/hr-agent";
import { financeAgent } from "./agents/finance-agent";
import { itAgent } from "./agents/it-agent";
import { basicSearchAgent } from "./agents/basic-search-agent";
import { hrRAGAgent } from "./rag/ragAgents";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

if (!process.env.MONGODB_DATABASE) {
  throw new Error("MONGODB_DATABASE environment variable is required");
}

const mongoVector = new MongoDBVector({
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DATABASE,
});

const ENV = process.env.NODE_ENV || "development";

export const mastra = new Mastra({
  agents: {
    hrAgent,
    financeAgent,
    itAgent,
    basicSearchAgent,
    hrRAGAgent,
  },
  vnext_networks: { worksyncNetwork: worksyncNetwork },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),

  vectors: {
    mongodb: mongoVector,
  },

  server: {
    cors:
      ENV === "development"
        ? {
            origin: "*",
            allowMethods: ["*"],
            allowHeaders: ["*"],
          }
        : undefined,
  },
});
