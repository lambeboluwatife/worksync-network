import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { worksyncNetwork } from "./networks/HRnetwork";
import { MongoDBVector } from "@mastra/mongodb";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

if (!process.env.MONGODB_DATABASE) {
  throw new Error('MONGODB_DATABASE environment variable is required');
}

const mongoVector = new MongoDBVector({
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DATABASE
});

const ENV = process.env.NODE_ENV || "development";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  vnext_networks: { "worksyncNetwork": worksyncNetwork },
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
    cors: ENV === "development" ? {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    } : undefined,
  },
});
