/**
 * Runner agéntico: bucle de razonamiento + uso de herramientas sobre DeepSeek.
 * Un solo lugar para todos los agentes de Impulsala.
 */

import { chatCompletion, type ChatMessage, type ToolSchema } from "./deepseek";
import { runTool, AGENT_TOOLS, type ToolContext } from "./tools";

export type AgentStep = { tool: string; args: string; result: unknown };

export type AgentReply = {
  text: string;
  steps: AgentStep[];
  tokens: number;
  model: string;
};

export async function runAgent(opts: {
  system: string;
  history: ChatMessage[];
  tools?: ToolSchema[];
  ctx?: ToolContext;
  maxSteps?: number;
  temperature?: number;
  model?: string;
}): Promise<AgentReply> {
  const tools = opts.tools ?? AGENT_TOOLS;
  const maxSteps = opts.maxSteps ?? 5;
  const messages: ChatMessage[] = [{ role: "system", content: opts.system }, ...opts.history];

  const steps: AgentStep[] = [];
  let tokens = 0;
  let text = "";
  const model = opts.model || process.env.DEEPSEEK_MODEL || "deepseek-chat";

  for (let i = 0; i < maxSteps; i++) {
    const res = await chatCompletion({
      messages,
      tools,
      temperature: opts.temperature ?? 0.45,
      model: opts.model,
    });
    tokens += res.tokens;

    const msg = res.message;
    const calls = msg.tool_calls || [];

    if (!calls.length) {
      text = (msg.content || "").trim();
      break;
    }

    messages.push({ role: "assistant", content: msg.content || null, tool_calls: calls });

    for (const call of calls) {
      const result = await runTool(call.function.name, call.function.arguments, opts.ctx);
      steps.push({ tool: call.function.name, args: call.function.arguments, result });
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        name: call.function.name,
        content: JSON.stringify(result).slice(0, 4000),
      });
    }

    if (i === maxSteps - 1) {
      // Última pasada sin herramientas para forzar respuesta final en texto
      const closing = await chatCompletion({ messages, temperature: opts.temperature ?? 0.45, model: opts.model });
      tokens += closing.tokens;
      text = (closing.message.content || "").trim();
    }
  }

  return { text, steps, tokens, model };
}

/** Historial de mensajes del widget convertido al formato del modelo. */
export function toHistory(
  turns: { role: "user" | "assistant"; content: string }[],
  limit = 12,
): ChatMessage[] {
  return turns
    .filter((t) => t.content?.trim())
    .slice(-limit)
    .map((t) => ({ role: t.role, content: t.content.trim().slice(0, 2000) }));
}
