import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableResponsesProvider } from "./ai-gateway.server";

const ToneSchema = z.enum(["formal", "friendly", "persuasive"]);
const HorizonSchema = z.enum(["daily", "weekly"]);

const EmailInputSchema = z.object({
  recipient: z.string().trim(),
  context: z.string().trim(),
  tone: ToneSchema,
});

const MeetingInputSchema = z.object({
  notes: z.string().trim(),
});

const PlannerInputSchema = z.object({
  tasks: z.string().trim(),
  horizon: HorizonSchema,
});

type AiResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

const MODEL_ID = "openai/gpt-6-astra";

async function runWorkplacePrompt(prompt: string): Promise<AiResult> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    return {
      ok: false,
      message: "AI generation is not configured yet.",
    };
  }

  try {
    const lovable = createLovableResponsesProvider(key);
    const result = streamText({
      model: lovable.responses(MODEL_ID),
      prompt,
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const text = (await result.text).trim();
    if (!text) {
      return {
        ok: false,
        message: "The AI response was empty. Please adjust the input and try again.",
      };
    }

    return { ok: true, text };
  } catch (error) {
    return { ok: false, message: getSafeAiErrorMessage(error) };
  }
}

function getSafeAiErrorMessage(error: unknown) {
  const status = findNumber(error, ["status", "statusCode"]);
  const gatewayMessage = findGatewayMessage(error);

  if (status === 400) {
    return gatewayMessage ?? "The request could not be processed. Please shorten or simplify the input.";
  }
  if (status === 401) {
    return gatewayMessage ?? "AI generation is not configured yet.";
  }
  if (status === 402) {
    return gatewayMessage ?? "AI credits are unavailable. Please add credits before generating more content.";
  }
  if (status === 403) {
    return gatewayMessage ?? "AI generation is currently blocked for this workspace.";
  }
  if (status === 429) {
    return gatewayMessage ?? "AI generation is temporarily rate limited. Please try again shortly.";
  }
  if (typeof status === "number" && status >= 500) {
    return gatewayMessage ?? "The AI service is temporarily unavailable. Please try again shortly.";
  }

  return gatewayMessage ?? "The AI request could not be completed. Please try again.";
}

function findNumber(value: unknown, keys: string[]): number | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const current = record[key];
    if (typeof current === "number") return current;
  }
  for (const nestedKey of ["cause", "response", "error"]) {
    const nested = findNumber(record[nestedKey], keys);
    if (typeof nested === "number") return nested;
  }
  return undefined;
}

function findGatewayMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of ["responseBody", "body", "data"]) {
    const parsed = parseMessage(record[key]);
    if (parsed) return parsed;
  }

  if (typeof record["message"] === "string" && record["message"].trim()) {
    return cleanErrorMessage(record["message"]);
  }

  for (const nestedKey of ["cause", "response", "error"]) {
    const nested = findGatewayMessage(record[nestedKey]);
    if (nested) return nested;
  }

  if (value instanceof Error && value.message.trim()) {
    return cleanErrorMessage(value.message);
  }

  return undefined;
}

function parseMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      const json = JSON.parse(trimmed) as unknown;
      return parseMessage(json) ?? cleanErrorMessage(trimmed);
    } catch {
      return cleanErrorMessage(trimmed);
    }
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["message", "error", "detail"]) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return cleanErrorMessage(candidate);
      }
      const parsed = parseMessage(candidate);
      if (parsed) return parsed;
    }
  }

  return undefined;
}

function cleanErrorMessage(message: string) {
  return message.replace(/\s+/g, " ").trim();
}

export const generateEmailDraft = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInputSchema.parse(input))
  .handler(async ({ data }) => {
    if (!data.recipient || !data.context) {
      return { ok: false, message: "Add a recipient and purpose before generating an email." } satisfies AiResult;
    }

    return runWorkplacePrompt(`Create a polished workplace email draft.

Recipient: ${data.recipient}
Tone: ${data.tone}
Purpose and context:
${data.context}

Requirements:
- Return only the editable email draft.
- Include a concise subject line.
- Keep it professional, specific, and ready to review.
- Do not invent facts, dates, prices, or commitments not provided.`);
  });

export const summarizeMeetingNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInputSchema.parse(input))
  .handler(async ({ data }) => {
    if (!data.notes) {
      return { ok: false, message: "Paste meeting notes before generating a summary." } satisfies AiResult;
    }

    return runWorkplacePrompt(`Summarize these workplace meeting notes into an editable, professional summary.

Raw notes:
${data.notes}

Use this exact structure:
Key discussion points
- ...

Decisions made
- ...

Action items
- Owner — task — deadline if mentioned

Rules:
- Keep wording concise and practical.
- If owners or deadlines are not mentioned, write "Not specified" for that part.
- Do not invent missing owners, deadlines, or decisions.`);
  });

export const generateTaskSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInputSchema.parse(input))
  .handler(async ({ data }) => {
    if (!data.tasks) {
      return { ok: false, message: "Add tasks before generating a schedule." } satisfies AiResult;
    }

    return runWorkplacePrompt(`Turn this task list into a structured ${data.horizon} workplace schedule.

Tasks, priorities, and optional deadlines:
${data.tasks}

Return only an editable schedule with:
- A short title.
- A Markdown table with these columns: Time/Order | Task | Priority | Deadline | Notes.
- Tasks ordered by priority and deadline.
- Reasonable time blocks for a ${data.horizon} plan.
- No invented deadlines; use "Not specified" when absent.`);
  });
