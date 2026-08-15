import { describe, expect, it } from "vitest";
import { eveGetInputSchema, eveStartInputSchema } from "./contracts";

describe("public MCP inputs", () => {
  it("applies bounded catch-up defaults", () => {
    expect(eveGetInputSchema.parse({ sessionId: "session_1" })).toEqual({
      sessionId: "session_1",
      cursor: 0,
      limit: 100,
    });
  });

  it("rejects blank prompts and oversized reads", () => {
    expect(() =>
      eveStartInputSchema.parse({ prompt: "  ", clientRequestId: "request_1" }),
    ).toThrow();
    expect(() =>
      eveGetInputSchema.parse({ sessionId: "session_1", limit: 251 }),
    ).toThrow();
  });
});
