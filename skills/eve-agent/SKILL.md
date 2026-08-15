---
name: eve-agent
description: Start, monitor, continue, respond to, and cancel durable Eve agent sessions.
---

# Eve agent orchestration

1. Use `eve_start` when a new objective benefits from durable work.
2. Preserve the returned `sessionId` and `cursor`.
3. Use `eve_get` to obtain evidence; accepted work is not completed work.
4. Call `eve_respond` only for the specific outstanding `requestId`.
5. Send unrelated follow-ups with `eve_send` only while the session is `waiting` and no input is unresolved.
6. Treat cancellation as cooperative. Poll until events prove the resulting state.
7. Open the session UI when visual progress or input controls help.
8. Fall back to text and `structuredContent` when MCP Apps is unavailable.
9. Never state that a side effect succeeded until a public event proves it.

Read [session semantics](references/session-semantics.md) for cursor and status rules.
