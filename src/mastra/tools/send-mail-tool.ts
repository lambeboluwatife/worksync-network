import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import Arcade from "@arcadeai/arcadejs";

const USER_ID = process.env.USER_ID;

interface SendMailInput {
  toolInput: {
    subject: string;
    body: string;
    recipient: string;
  };
}

export const sendMail = async ({ toolInput }: SendMailInput) => {
  const client = new Arcade();

  const auth = await client.tools.authorize({
    tool_name: "Gmail.SendEmail@3.0.0",
    user_id: USER_ID,
  });

  if (auth?.status !== "completed") {
    console.log(`Click here to authorize the tool: ${auth?.url}`);
  }

  const { status } = await client.auth.waitForCompletion(auth);

  if (status !== "completed") {
    throw new Error("Authorization failed");
  }

  console.log("🚀 Authorization successful!");

  const result = await client.tools.execute({
    tool_name: "Gmail.SendEmail@3.0.0",
    input: {
      starred: "true",
      subject: toolInput.subject,
      body: toolInput.body,
      recipient: toolInput.recipient,
    },
    user_id: USER_ID,
  });

  return result;
};

export const sendMailTool = createTool({
  id: "send-mail",
  description: `Sends an email using the ArcadeAI Google.SendEmail tool.`,
  inputSchema: z.object({
    recipient: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject"),
    body: z.string().describe("Email body"),
  }),
  outputSchema: z.object({
    status: z.string().describe("Status of the email sending process"),
    details: z.any().optional().describe("Additional details or error info"),
  }),
  execute: async ({ context }) => {
    try {
      await sendMail({
        toolInput: {
          subject: context.subject,
          body: context.body,
          recipient: context.recipient,
        },
      });
      return { status: "Email sent successfully" };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { 
        status: `Failed to send email`, 
        details: (error instanceof Error ? error.message : String(error)) 
      };
    }
  },
});
