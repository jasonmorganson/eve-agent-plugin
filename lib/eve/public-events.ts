import type {
  EveSessionStatus,
  PublicEveEvent,
  PublicInputRequest,
} from "@/lib/mcp/contracts";

export type InternalEveEvent = {
  type: string;
  index: number;
  turnId?: string;
  text?: string;
  label?: string;
  state?: string;
  request?: PublicInputRequest;
  code?: string;
  message?: string;
  status?: EveSessionStatus;
};

const progressStates = new Set(["started", "completed", "failed"]);

/** Allowlist an internal event. Unknown, reasoning, and raw tool events are dropped. */
export function toPublicEvent(event: InternalEveEvent): PublicEveEvent | null {
  switch (event.type) {
    case "assistant.message":
      return event.turnId && event.text !== undefined
        ? {
            type: "assistant_message",
            index: event.index,
            turnId: event.turnId,
            text: event.text,
          }
        : null;
    case "progress":
      return event.label && event.state && progressStates.has(event.state)
        ? {
            type: "progress",
            index: event.index,
            turnId: event.turnId,
            label: event.label,
            state: event.state as "started" | "completed" | "failed",
          }
        : null;
    case "input.requested":
      return event.request
        ? { type: "input_required", index: event.index, request: event.request }
        : null;
    case "status":
      return event.status
        ? { type: "status", index: event.index, status: event.status }
        : null;
    case "error.public":
      return event.code && event.message
        ? {
            type: "error",
            index: event.index,
            code: event.code,
            message: event.message,
          }
        : null;
    default:
      return null;
  }
}
