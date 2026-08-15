import { AdapterNotConfiguredError } from "@/lib/eve/service";
import type { EveSessionResult } from "@/lib/mcp/contracts";

export const SESSION_RESOURCE_URI = "ui://eve-agent/session.html";

export function toolResult(result: EveSessionResult, text: string) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent: result,
    _meta: { ui: { resourceUri: SESSION_RESOURCE_URI } },
  };
}

export function safeToolError(error: unknown, sessionId = "") {
  const notConfigured = error instanceof AdapterNotConfiguredError;
  const message = notConfigured
    ? "This starter is not connected to its production Eve adapter yet."
    : "The operation failed safely.";
  const result: EveSessionResult = {
    sessionId,
    status: "failed",
    cursor: 0,
    events: [],
    error: {
      code: notConfigured ? "adapter_not_configured" : "internal_error",
      message,
    },
  };
  return { ...toolResult(result, message), isError: true };
}
