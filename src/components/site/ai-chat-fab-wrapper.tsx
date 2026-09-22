"use client";

import dynamic from "next/dynamic";

const AiChatFab = dynamic(() => import("@/components/site/ai-chat-fab"));

export default function AiChatFabWrapper() {
  return <AiChatFab />;
}
