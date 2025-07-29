import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { sendMailTool } from "./send-mail-tool";

import {
  adminAgent,
  networkAgent,
  securityAgent,
  systemsAgent,
} from "../agents/it-sub-agents";
import { registerEmployeeCall, passwordResetCall } from "../calls";

// Register Employee Tool
export const registerEmployeeTool = createTool({
  id: "register-employee",
  description: "Handles employee registration and account management tasks.",
  inputSchema: z.object({
    name: z.string().min(1).describe("The name of the new employee"),
    email: z.string().email().describe("The email address of the new employee"),
    jobRole: z.string().describe("The job role of the new employee"),
    startDate: z
      .string().optional().describe("The start date of the new employee"),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the registration was successful"),
    message: z
      .string()
      .describe("Message providing details about the registration"),
    employee: z.string().optional().describe("The registered employee's ID or details"),
    token: z
      .string()
      .optional()
      .describe("The token for the new account, if applicable"),
  }),
  execute: async ({ context }) => {
    const { name, email, jobRole, startDate } = context;

    // Input validation
    if (!name?.trim() || !email?.trim() || !jobRole?.trim()) {
      return {
        success: false,
        message: "Please make sure to fill in all required information.",
      };
    }

    try {
      const response = await registerEmployeeCall(name, email, jobRole, startDate);

      if (response.success) {
        // Call adminAgent.generate to log/confirm registration
        const adminResult = await adminAgent.generate(
          `A new employee has been registered with email: ${email}. Confirm registration.`
        );

        return {
          success: true,
          message: `Employee registered successfully. AdminAgent: ${adminResult.text}`,
          token: response.token,
        };
      }

      // Handle specific error cases
      if (response.error?.toLowerCase().includes("exists")) {
        return {
          success: false,
          message:
            "This email address already exists. Please use a different email.",
        };
      }

      if (response.error?.toLowerCase().includes("invalid")) {
        return {
          success: false,
          message:
            "The provided email address is invalid. Please check and try again.",
        };
      }

      return {
        success: false,
        message:
          "We couldn't complete your registration at this moment. Please try again or contact support if the problem persists.",
      };
    } catch (error) {
      console.error("Error in registerAdminTool:", error);

      return {
        success: false,
        message:
          "We're having some technical difficulties. Please try again in a few moments.",
      };
    }
  },
});

export const resetPasswordTool = createTool({
  id: "reset-password",
  description: "Handles password reset requests for admin accounts.",
  inputSchema: z.object({
    email: z.string().email().describe("The user's email address"),
    newPassword: z.string().min(1).describe("The new password for the account"),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the password reset was successful"),
    message: z
      .string()
      .describe("Message providing details about the password reset"),
    emailStatus: z.string().optional(),
  }),
  execute: async ({ context, runtimeContext }) => {
    const { email, newPassword } = context;

    // Input validation
    if (!email?.trim() || !newPassword?.trim()) {
      return {
        success: false,
        message: "Please make sure to fill in all required information.",
      };
    }

    try {
      const response = await passwordResetCall(email, newPassword);

      if (response.success) {
        // Call adminAgent.generate to log/confirm registration
        const adminResult = await adminAgent.generate(
          `The password of: ${email} has been reset. Please check your mail for confirmation.`
        );
        // Send confirmation email
        const emailResult = await sendMailTool.execute({
          context: {
            recipient: email,
            subject: "Your password has been reset",
            body: `Your password was successfully reset. If you did not request this, please contact support immediately. Your new password is: ${newPassword}`,
          },
          runtimeContext,
        });
        return {
          success: true,
          message: `Password successfully reset. AdminAgent: ${adminResult.text}`,
          emailStatus: emailResult.status,
        };
      }

      return {
        success: false,
        message:
          "We couldn't complete your registration at this moment. Please try again or contact support if the problem persists.",
      };
    } catch (error) {
      console.error("Error in AdminTool:", error);

      return {
        success: false,
        message:
          "We're having some technical difficulties. Please try again in a few moments.",
      };
    }
  },
});
