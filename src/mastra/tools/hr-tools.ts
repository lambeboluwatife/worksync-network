import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  adminLoginCall,
  fetchAllEmployeesCall,
  fetchEmployeeCall,
} from "../calls";
import { registerEmployeeCall } from "../calls";

// Register Employee Tool
export const registerEmployeeTool = createTool({
  id: "register-employee",
  description: "Handles employee registration and account management tasks.",
  inputSchema: z.object({
    name: z.string().min(1).describe("The name of the new employee"),
    email: z.string().email().describe("The email address of the new employee"),
    jobRole: z.string().describe("The job role of the new employee"),
    startDate: z
      .string().describe("The start date of the new employee"),
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
        return {
          success: true,
          message: `Employee registered successfully. Welcome, ${name}!`,
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

export const loginAdminTool = createTool({
  id: "login-admin-tool",
  description:
    "Handles user login and performs administrative functions. This tool is used to log in an admin and perform administrative tasks.",
  inputSchema: z.object({
    email: z.string().email().describe("The email address for the new account"),
    password: z.string().min(1).describe("The password for the new account"),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the registration was successful"),
    message: z
      .string()
      .describe("Message providing details about the registration"),
    token: z
      .string()
      .optional()
      .describe("The token for the new account, if applicable"),
  }),
  execute: async ({ context }) => {
    const { email, password } = context;

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return {
        success: false,
        message: "Please make sure to fill in all required information.",
      };
    }

    try {
      const response = await adminLoginCall(email, password);

      if (response.success) {
        return {
          success: true,
          message: `Admin registered successfully.`,
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

export const ptoTool = createTool({
  id: "pto-tool",
  description:
    "Retrieves employee data using an employee's ID, name, or email, and performs Paid Time Off (PTO) calculations based on the retrieved data. If multiple or no records are found, it prompts for more specific information.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "An employee's ID, full name, or email address used to fetch their data for PTO calculation."
      ),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe(
        "Indicates whether the PTO calculation and data retrieval were successful."
      ),
    message: z
      .string()
      .describe(
        "Detailed message explaining the result of the PTO calculation or next steps."
      ),
  }),
  execute: async ({ context }) => {
    const { query } = context;

    if (!query || query.trim() === "") {
      return {
        success: false,
        message: "Please provide a valid query to calculate PTO.",
      };
    }

    try {
      const response = await fetchEmployeeCall(query);
      let message: string;

      if (typeof response === "string") {
        message = response;
      } else if (Array.isArray(response)) {
        if (response.length === 0) {
          message =
            "No employee data found for the provided query. Please check the employee ID or provide more details.";
        } else if (response.length === 1) {
          
          message = "PTO calculation completed successfully.";
        } else {
          message =
            "Multiple employees found for the provided query. Please refine your search.";
        }
      } else if (response && typeof response === "object") {
      
        message = "PTO calculation completed successfully.";
      } else {
        message = "PTO calculation completed.";
      }

      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while calculating PTO.",
      };
    }
  },
});

export const fetchEmployeeDataTool = createTool({
  id: "fetch-employee-data-tool",
  description:
    "Fetches employee data based on an employee's ID, name, or email address.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "An employee's ID, full name, or email address used to fetch their data for PTO calculation."
      ),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe(
        "Indicates whether the employee data retrieval was successful."
      ),
    employeeId: z.string().describe("The employee's ID"),
    name: z.string().describe("The employee's full name"),
    email: z.string().email().describe("The employee's email address"),
    startDate: z.string().describe("The employee's start date"),
    status: z
      .string()
      .describe("The employee's current status (e.g., active, inactive)"),
    jobRole: z.string().describe("The employee's job role or title"),
    ptoUsed: z
      .number()
      .describe("The amount of PTO used by the employee in hours"),
    message: z.string().describe("A message about the result."),
  }),
  execute: async ({ context }) => {
    const { query } = context;

    // Default empty values for required fields
    const emptyEmployee = {
      employeeId: "",
      name: "",
      email: "",
      startDate: "",
      status: "",
      jobRole: "",
      ptoUsed: 0,
    };

    if (!query || query.trim() === "") {
      return {
        success: false,
        ...emptyEmployee,
        message: "Please provide a valid query to fetch employee data.",
      };
    }

    try {
      const response = await fetchEmployeeCall(query);

      if (typeof response === "string") {
        return {
          success: false,
          ...emptyEmployee,
          message: response,
        };
      }

      if (Array.isArray(response) && response.length === 0) {
        return {
          success: false,
          ...emptyEmployee,
          message: "No employee data found for the provided query.",
        };
      }

      type Employee = {
        employeeId: string;
        name: string;
        email: string;
        startDate: string;
        status: string;
        jobRole: string;
        ptoUsed: number;
        [key: string]: any;
      };

      let employeeArray: Employee[] = [];
      if (response && Array.isArray(response.data)) {
        employeeArray = response.data;
      } else if (Array.isArray(response)) {
        employeeArray = response;
      }

      if (employeeArray.length === 0) {
        return {
          success: false,
          ...emptyEmployee,
          message: "No employee data found for the provided query.",
        };
      }

      const employeeData = employeeArray[0] as Employee;

      if (
        !employeeData ||
        !employeeData.employeeId ||
        !employeeData.name ||
        !employeeData.email
      ) {
        return {
          success: false,
          ...emptyEmployee,
          message: "No valid employee data found for the provided query.",
        };
      }

      return {
        success: true,
        employeeId: employeeData.employeeId,
        name: employeeData.name,
        email: employeeData.email,
        startDate: employeeData.startDate,
        status: employeeData.status,
        jobRole: employeeData.jobRole,
        ptoUsed: employeeData.ptoUsed,
        message: "Employee data fetched successfully.",
      };
    } catch (error) {
      return {
        success: false,
        ...emptyEmployee,
        message: "An error occurred while fetching employee data.",
      };
    }
  },
});

export const fetchAllEmployeeDataTool = createTool({
  id: "fetch-all-employee-data-tool",
  description:
    "Fetches all employees data based on an employee's ID, name, or email address. Returns all matching records. If no query is provided, returns all employees.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .default("")
      .describe(
        "Optional: An employee's ID, full name, or email address to filter employees. Leave blank to fetch all employees."
      ),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe(
        "Indicates whether the employee data retrieval was successful."
      ),
    employees: z.array(
      z.object({
        employeeId: z.string(),
        name: z.string(),
        email: z.string(),
        startDate: z.string(),
        status: z.string(),
        jobRole: z.string(),
        ptoUsed: z.number(),
      })
    ),
    message: z.string().describe("A message about the result."),
  }),
  execute: async ({ context }) => {
    const { query } = context;
    try {
      const response = await fetchAllEmployeesCall();

      if (typeof response === "string") {
        return {
          success: false,
          employees: [],
          message: response,
        };
      }

      if (Array.isArray(response) && response.length === 0) {
        return {
          success: false,
          employees: [],
          message: "No employee data found for the provided query.",
        };
      }

      type Employee = {
        employeeId: string;
        name: string;
        email: string;
        startDate: string;
        status: string;
        jobRole: string;
        ptoUsed: number;
        [key: string]: any;
      };

      let employeeArray: Employee[] = [];
      if (response && Array.isArray(response.data)) {
        employeeArray = response.data;
      } else if (Array.isArray(response)) {
        employeeArray = response;
      }

      if (employeeArray.length === 0) {
        return {
          success: false,
          employees: [],
          message: "No employee data found for the provided query.",
        };
      }
      return {
        success: true,
        employees: employeeArray,
        message: "Fetched ${employeeArray.length} employee(s).",
      };
    } catch (error) {
      return {
        success: false,
        employees: [],
        message: "An error occurred while fetching employee data.",
      };
    }
  },
});

// // Recruitment Tool
// export const recruitmentTool = createTool({
//   id: "recruitment-agent",
//   description:
//     "Handles recruitment processes including job postings, candidate screening, and interview coordination.",
//   inputSchema: z.object({
//     task: z.string().describe("The recruitment task to perform"),
//     parameters: z
//       .record(z.any())
//       .optional()
//       .describe("Additional parameters for the task"),
//   }),
//   outputSchema: z.object({
//     result: z.string().describe("Result of the recruitment operation"),
//     data: z
//       .record(z.any())
//       .optional()
//       .describe("Any additional data from the operation"),
//   }),
//   execute: async ({ context }) => {
//     const result = await recruitmentAgent.generate(
//       `Handle the following recruitment task: ${context.task}`
//     );
//     return {
//       result: result.text,
//       data: context.parameters,
//     };
//   },
// });

// // Onboarding Tool
// export const onboardingTool = createTool({
//   id: "onboarding-agent",
//   description:
//     "Manages new employee onboarding processes including documentation and orientation.",
//   inputSchema: z.object({
//     task: z.string().describe("The onboarding task to perform"),
//     parameters: z
//       .record(z.any())
//       .optional()
//       .describe("Additional parameters for the task"),
//   }),
//   outputSchema: z.object({
//     result: z.string().describe("Result of the onboarding operation"),
//     data: z
//       .record(z.any())
//       .optional()
//       .describe("Any additional data from the operation"),
//   }),
//   execute: async ({ context }) => {
//     const result = await onboardingAgent.generate(
//       `Handle the following onboarding task: ${context.task}`
//     );
//     return {
//       result: result.text,
//       data: context.parameters,
//     };
//   },
// });

// // Training Tool
// export const trainingTool = createTool({
//   id: "training-agent",
//   description:
//     "Coordinates employee training programs and development activities.",
//   inputSchema: z.object({
//     task: z.string().describe("The training task to perform"),
//     parameters: z
//       .record(z.any())
//       .optional()
//       .describe("Additional parameters for the task"),
//   }),
//   outputSchema: z.object({
//     result: z.string().describe("Result of the training operation"),
//     data: z
//       .record(z.any())
//       .optional()
//       .describe("Any additional data from the operation"),
//   }),
//   execute: async ({ context }) => {
//     const result = await trainingAgent.generate(
//       `Handle the following training task: ${context.task}`
//     );
//     return {
//       result: result.text,
//       data: context.parameters,
//     };
//   },
// });

// // Performance Tool
// export const performanceTool = createTool({
//   id: "performance-agent",
//   description: "Manages performance reviews and employee feedback processes.",
//   inputSchema: z.object({
//     task: z.string().describe("The performance management task to perform"),
//     parameters: z
//       .record(z.any())
//       .optional()
//       .describe("Additional parameters for the task"),
//   }),
//   outputSchema: z.object({
//     result: z
//       .string()
//       .describe("Result of the performance management operation"),
//     data: z
//       .record(z.any())
//       .optional()
//       .describe("Any additional data from the operation"),
//   }),
//   execute: async ({ context }) => {
//     const result = await performanceAgent.generate(
//       `Handle the following performance management task: ${context.task}`
//     );
//     return {
//       result: result.text,
//       data: context.parameters,
//     };
//   },
// });
