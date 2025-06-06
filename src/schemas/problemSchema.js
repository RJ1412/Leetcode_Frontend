import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficuilty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON: z.string().min(1),
    JAVA: z.string().min(1),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON: z.string().min(1),
    JAVA: z.string().min(1),
  }),
});
