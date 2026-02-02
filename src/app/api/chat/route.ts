import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: string } = await req.json();

  const systemPrompt = context
    ? `You are a helpful AI assistant. 
You are answering questions about a specific PDF document provided by the user.

Here is the relevant context from the PDF document:
${context}

Instructions:
- Answer the user's question based ONLY on the provided context.
- If the answer is not in the context, politely say you don't know based on the document.
- Keep your answers concise and professional.
- Do not mention that you were provided "context chunks", just refer to "the document".
`
    : "You are a helpful AI assistant.";

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
