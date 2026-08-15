import { createMcpHandler } from "mcp-handler";

import { createEveSessionService } from "@/lib/eve/service";
import {
  eveCancelInputSchema,
  eveGetInputSchema,
  eveRespondInputSchema,
  eveSendInputSchema,
  eveSessionResultSchema,
  eveStartInputSchema,
} from "@/lib/mcp/contracts";
import {
  safeToolError,
  SESSION_RESOURCE_URI,
  toolResult,
} from "@/lib/mcp/result";

export const runtime = "nodejs";

const service = createEveSessionService();
const sessionHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Eve session</title><style>body{font:14px system-ui;margin:0;padding:20px;color:#171717;background:#fafafa}main{max-width:42rem;margin:auto}code{background:#eee;padding:.15rem .35rem;border-radius:.25rem}</style></head><body><main><h1>Eve session</h1><p>The host initializes this MCP App and supplies tool results. Complete the production bridge in <code>app/ui/session</code>.</p></main></body></html>`;

const handler = createMcpHandler((server) => {
  server.registerResource(
    "eve-session",
    SESSION_RESOURCE_URI,
    { title: "Eve session", mimeType: "text/html" },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/html", text: sessionHtml }],
    }),
  );

  server.registerTool(
    "eve_start",
    {
      title: "Start Eve work",
      description: "Start a new durable Eve objective and return immediately.",
      inputSchema: eveStartInputSchema,
      outputSchema: eveSessionResultSchema,
      _meta: { ui: { resourceUri: SESSION_RESOURCE_URI } },
    },
    async (input) => {
      try {
        return toolResult(
          await service.start(input),
          "Eve accepted the objective.",
        );
      } catch (error) {
        return safeToolError(error);
      }
    },
  );
  server.registerTool(
    "eve_get",
    {
      title: "Get Eve session",
      description: "Read the next bounded page of public session events.",
      inputSchema: eveGetInputSchema,
      outputSchema: eveSessionResultSchema,
      _meta: { ui: { resourceUri: SESSION_RESOURCE_URI } },
    },
    async (input) => {
      try {
        return toolResult(await service.get(input), "Fetched the Eve session.");
      } catch (error) {
        return safeToolError(error, input.sessionId);
      }
    },
  );
  server.registerTool(
    "eve_send",
    {
      title: "Send Eve follow-up",
      description: "Send a follow-up while an owned session is waiting.",
      inputSchema: eveSendInputSchema,
      outputSchema: eveSessionResultSchema,
    },
    async (input) => {
      try {
        return toolResult(await service.send(input), "Sent the follow-up.");
      } catch (error) {
        return safeToolError(error, input.sessionId);
      }
    },
  );
  server.registerTool(
    "eve_respond",
    {
      title: "Respond to Eve request",
      description: "Answer one specific outstanding input or approval request.",
      inputSchema: eveRespondInputSchema,
      outputSchema: eveSessionResultSchema,
    },
    async (input) => {
      try {
        return toolResult(
          await service.respond(input),
          "Recorded the response.",
        );
      } catch (error) {
        return safeToolError(error, input.sessionId);
      }
    },
  );
  server.registerTool(
    "eve_cancel",
    {
      title: "Cancel Eve turn",
      description: "Request cooperative cancellation of the active Eve turn.",
      inputSchema: eveCancelInputSchema,
      outputSchema: eveSessionResultSchema,
    },
    async (input) => {
      try {
        return toolResult(
          await service.cancel(input),
          "Cancellation was requested.",
        );
      } catch (error) {
        return safeToolError(error, input.sessionId);
      }
    },
  );
});

export { handler as GET, handler as POST };
