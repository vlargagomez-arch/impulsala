/**
 * Cliente mínimo para la API de DeepSeek (compatible con OpenAI Chat Completions).
 * Sin SDK externo: usa fetch, disponible en el runtime de Next.js / Vercel.
 *
 * Variables de entorno:
 *   DEEPSEEK_API_KEY  (obligatoria)
 *   DEEPSEEK_BASE_URL (opcional, default https://api.deepseek.com/v1)
 *   DEEPSEEK_MODEL    (opcional, default deepseek-chat)
 */

export type ChatRole = "system" | "user" | "assistant" | "tool";

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type ChatMessage = {
  role: ChatRole;
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
};

export type ToolSchema = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ChatResult = {
  message: ChatMessage;
  finishReason: string;
  tokens: number;
};

export class DeepSeekError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "DeepSeekError";
    this.status = status;
  }
}

const BASE_URL = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
export const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

export function hasDeepSeekKey(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

export async function chatCompletion(opts: {
  messages: ChatMessage[];
  tools?: ToolSchema[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  jsonMode?: boolean;
}): Promise<ChatResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new DeepSeekError("Falta DEEPSEEK_API_KEY en el entorno", 500);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 55_000);

  const payload: Record<string, unknown> = {
    model: opts.model || DEFAULT_MODEL,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    stream: false,
  };
  if (opts.tools?.length) {
    payload.tools = opts.tools;
    payload.tool_choice = "auto";
  }
  if (opts.maxTokens) payload.max_tokens = opts.maxTokens;
  if (opts.jsonMode) payload.response_format = { type: "json_object" };

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new DeepSeekError(
        `DeepSeek ${res.status}: ${detail.slice(0, 400) || res.statusText}`,
        res.status === 429 ? 429 : 502,
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: ChatMessage; finish_reason?: string }[];
      usage?: { total_tokens?: number };
      error?: { message?: string };
    };

    if (data.error?.message) throw new DeepSeekError(data.error.message, 502);

    const choice = data.choices?.[0];
    if (!choice?.message) throw new DeepSeekError("Respuesta vacía de DeepSeek", 502);

    return {
      message: {
        role: "assistant",
        content: choice.message.content ?? "",
        tool_calls: choice.message.tool_calls,
      },
      finishReason: choice.finish_reason || "stop",
      tokens: data.usage?.total_tokens || 0,
    };
  } catch (err) {
    if (err instanceof DeepSeekError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("abort")) {
      throw new DeepSeekError("El modelo tardó demasiado en responder", 504);
    }
    throw new DeepSeekError(msg, 502);
  } finally {
    clearTimeout(timeout);
  }
}

/** Atajo para una respuesta de texto única (sin herramientas). */
export async function askOnce(opts: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  jsonMode?: boolean;
  maxTokens?: number;
}): Promise<string> {
  const result = await chatCompletion({
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
    model: opts.model,
    temperature: opts.temperature,
    jsonMode: opts.jsonMode,
    maxTokens: opts.maxTokens,
  });
  return (result.message.content || "").trim();
}
