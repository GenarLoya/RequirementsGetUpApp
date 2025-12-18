import { z } from "zod";
import { QuestionType } from "../../../../generated/prisma/client";

// Question types that require options/choices
const choiceTypes = ["RADIO", "CHECKBOX", "SELECT"] as const;

// Schema for question options (for choice-based questions)
const questionOptionsSchema = z
  .object({
    choices: z.array(z.string().min(1)).min(2, "At least 2 choices required"),
  })
  .loose(); // Allow additional fields like placeholder, min, max, etc.

// Create question schema
export const createQuestionSchema = z
  .object({
    text: z.string().min(1, "Question text is required").max(500),
    type: z.enum(Object.values(QuestionType)),
    required: z.boolean().optional().default(false),
    options: questionOptionsSchema.optional(),
  })
  .refine(
    (data) => {
      // If question type requires choices, ensure options.choices exists
      if (choiceTypes.includes(data.type as any)) {
        return data.options?.choices && data.options.choices.length >= 2;
      }
      return true;
    },
    {
      message:
        "RADIO, CHECKBOX, and SELECT questions require at least 2 choices",
      path: ["options"],
    },
  );

// Update question schema
export const updateQuestionSchema = z
  .object({
    text: z.string().min(1).max(500).optional(),
    type: z.enum(Object.values(QuestionType)).optional(),
    required: z.boolean().optional(),
    options: questionOptionsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.type && choiceTypes.includes(data.type as any)) {
        return data.options?.choices && data.options.choices.length >= 2;
      }
      return true;
    },
    {
      message:
        "RADIO, CHECKBOX, and SELECT questions require at least 2 choices",
      path: ["options"],
    },
  );

// Reorder schema
export const reorderQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.uuid(),
        order: z.number().int().min(0),
      }),
    )
    .min(1),
});

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
export type ReorderQuestionsDto = z.infer<typeof reorderQuestionsSchema>;
