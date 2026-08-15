import type { EveSessionResult } from "@/lib/mcp/contracts";

export class AdapterNotConfiguredError extends Error {
  constructor() {
    super(
      "The Eve ownership, idempotency, and authenticated client adapter has not been configured.",
    );
    this.name = "AdapterNotConfiguredError";
  }
}

export interface EveSessionService {
  start(input: {
    prompt: string;
    clientRequestId: string;
  }): Promise<EveSessionResult>;
  get(input: {
    sessionId: string;
    cursor: number;
    limit: number;
  }): Promise<EveSessionResult>;
  send(input: {
    sessionId: string;
    message: string;
    clientRequestId: string;
  }): Promise<EveSessionResult>;
  respond(input: {
    sessionId: string;
    requestId: string;
    response:
      | { kind: "approve" }
      | { kind: "deny" }
      | { kind: "answer"; value: string; optionId?: string };
    clientRequestId: string;
  }): Promise<EveSessionResult>;
  cancel(input: {
    sessionId: string;
    turnId?: string;
  }): Promise<EveSessionResult>;
}

const notConfigured = async (): Promise<never> => {
  throw new AdapterNotConfiguredError();
};

/** Replace only after implementing verified ownership, durable idempotency, and Eve OIDC. */
export function createEveSessionService(): EveSessionService {
  return {
    start: notConfigured,
    get: notConfigured,
    send: notConfigured,
    respond: notConfigured,
    cancel: notConfigured,
  };
}
