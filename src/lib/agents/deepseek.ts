/**
 * Cliente mínimo para la API de DeepSeek (compatible con OpenAI Chat Completions).
 * Sin SDK externo: usa fetch, disponible en el runtime de Next.js / Vercel.
 *
 * Variables de entorno:
 *   DEEPSEEK_API_KEY  (obligatoria)
 *   DEEPSEEK_BASE_URL (opcional, default https://api.deepseek.com/v1)
 *   DEEPSEEK_MODEL    (opcional, default deepseek-flash = el modelo más económico)
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
  /** Modelo que realmente sirvió la respuesta (lo devuelve la API). */
  model?: string;
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
export const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-flash";

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
      model?: string;
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
      model: data.model,
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

export type AskFull = { text: string; finishReason: string; tokens: number; model?: string };

/** Igual que askOnce pero expone por qué terminó (finishReason === "length" = respuesta truncada). */
export async function askOnceFull(opts: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  jsonMode?: boolean;
  maxTokens?: number;
}): Promise<AskFull> {
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
  return {
    text: (result.message.content || "").trim(),
    finishReason: result.finishReason,
    tokens: result.tokens,
    model: result.model,
  };
}

function tryParse(s: string): unknown | undefined {
  try {
    return JSON.parse(s) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Repara un JSON truncado: cierra el string abierto, elimina la última propiedad sin valor
 * o la coma colgante, y cierra los contenedores en orden inverso.
 */
function repairTruncatedJson(s: string): string {
  const stack: string[] = [];
  let out = "";
  let inStr = false;
  let esc = false;
  for (const ch of s) {
    if (esc) {
      out += ch;
      esc = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      esc = true;
      continue;
    }
    if (ch === '"') {
      inStr = !inStr;
      out += ch;
      continue;
    }
    if (inStr) {
      out += ch;
      continue;
    }
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") {
      if (stack[stack.length - 1] === ch) stack.pop();
    }
    out += ch;
  }
  if (inStr) out += '"';
  out = out.replace(/,?\s*"[^"]*"\s*:\s*$/, "").replace(/,\s*$/, "").replace(/:\s*$/, ":null");
  while (stack.length) out += stack.pop();
  return out;
}

/**
 * Extrae un objeto/arreglo JSON de un texto de modelo: quita las vallas ```json,
 * recorta al primer {...} y tolera respuestas truncadas por límite de tokens.
 * Devuelve null si no hay nada parseable.
 */
export function extractJson(raw: string): unknown | null {
  if (!raw) return null;
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  s = s.replace(/^\s*json\s*\n/i, "");

  const directo = tryParse(s);
  if (directo !== undefined) return directo;

  const first = s.search(/[{[]/);
  if (first < 0) return null;
  const corte = s.slice(first);
  const last = Math.max(corte.lastIndexOf("}"), corte.lastIndexOf("]"));
  if (last > 0) {
    const recortado = tryParse(corte.slice(0, last + 1));
    if (recortado !== undefined) return recortado;
  }
  const reparado = tryParse(repairTruncatedJson(corte));
  return reparado === undefined ? null : reparado;
}

/**
 * Pide al modelo una respuesta JSON y la devuelve ya parseada.
 * Reintenta una vez si el JSON llegó cortado o inválido (respuesta más corta y compacta).
 * Tira un error con diagnóstico (finishReason, longitud) si aun así no hay JSON.
 */
export async function askJson<T = unknown>(opts: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<{ data: T; finishReason: string; text: string }> {
  const base = opts.maxTokens ?? 2600;
  let lastText = "";
  let lastFinish = "";

  for (let intento = 1; intento <= 2; intento++) {
    const user =
      intento === 1
        ? opts.user
        : `${opts.user}\n\nIMPORTANTE: tu respuesta anterior llegó cortada o no era JSON válido. Devuelve SOLO el JSON completo, compacto (sin markdown, sin comentarios, sin texto antes ni después) y más breve: menos bloques y frases cortas.`;
    const r = await askOnceFull({
      system: opts.system,
      user,
      model: opts.model,
      temperature: opts.temperature ?? 0.7,
      jsonMode: true,
      maxTokens: intento === 1 ? base : Math.min(8000, Math.round(base * 1.8)),
    });
    lastText = r.text;
    lastFinish = r.finishReason;
    const parsed = extractJson(r.text);
    if (parsed && typeof parsed === "object") {
      return { data: parsed as T, finishReason: r.finishReason, text: r.text };
    }
    console.warn(`[deepseek] JSON inválido en intento ${intento} (finish=${r.finishReason}, ${r.text.length} chars)`);
  }

  throw new Error(
    `El agente no devolvió JSON válido (finish=${lastFinish || "?"}, ${lastText.length} caracteres, inicio: ${lastText.slice(0, 120).replace(/\s+/g, " ")})`,
  );
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
