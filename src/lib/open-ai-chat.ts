/**
 * Helper para abrir el Asistente IA (ImpulsaBot) desde cualquier botón.
 * Dispara un evento global que el componente AiChatFab escucha.
 *
 * @param options.startBooking — si true, inicia el flujo de agendamiento directo
 * @param options.diagnostic — si true, inicia conversación de diagnóstico personalizada
 *
 * Uso:
 *   import { openAiChat } from "@/lib/open-ai-chat";
 *   <button onClick={() => openAiChat({ startBooking: true })}>Agendar</button>
 *   <button onClick={() => openAiChat({ diagnostic: true })}>Solicitar diagnóstico</button>
 */
export function openAiChat(options?: { startBooking?: boolean; diagnostic?: boolean }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("open-ai-chat", {
      detail: {
        startBooking: options?.startBooking ?? false,
        diagnostic: options?.diagnostic ?? false,
      },
    })
  );
}
