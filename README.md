# Eve Agent Plugin

A public, template-only TypeScript starter for exposing a durable [Eve](https://github.com/vercel/eve) agent as a portable [Agent Plugin](https://agent-plugins.org/) with a standards-first MCP surface.

The repository deliberately ships fail-closed. It gives project authors the package shape, five-tool public contract, event allowlist, database schema, configuration scripts, tests, and CI foundation without pretending that OAuth, tenant ownership, cross-system idempotency, or the production Eve adapter have been completed.

## What is included

- Next.js 16 App Router hosting shell with Eve `0.38.3` mounted through `withEve()`.
- Portable Agent Plugins 1.0.0 manifests as the source of truth.
- Generated current Codex/OpenAI compatibility package.
- Stateless `/mcp` handler with `eve_start`, `eve_get`, `eve_send`, `eve_respond`, and `eve_cancel`.
- Public result schemas and allowlist-only event projection tests.
- Drizzle ownership/idempotency table definitions.
- Generic Eve instructions and an outer orchestration skill.
- Minimal `/healthz`; the root route returns `404`.
- Pinned dependencies, frozen lockfile, CI, and weekly Dependabot groups.

## Start locally

Use Node.js 24 and pnpm 11.7.0.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

Eve's interactive development REPL is available separately:

```bash
pnpm exec eve dev
```

## Configure the package

Replace the generic agent instructions and add domain tools before release. Then set the literal production MCP origin:

```bash
pnpm configure --origin https://agent.example.com
pnpm validate:plugin
```

After registering the remote MCP connection with OpenAI, generate its adapter:

```bash
pnpm build:openai-package --connection-id your_registered_connection_id
```

Never put bearer tokens or secrets in `mcp.json` or `.app.json`.

## Production boundary

`lib/eve/service.ts` intentionally rejects every operation until it is replaced by an ownership-scoped, idempotent, authenticated adapter. Read [the implementation gates](docs/implementation-gates.md) before doing that work.

The installed Eve documentation in `node_modules/eve/docs/` governs the pinned runtime. Eve now includes its own four-tool MCP channel, but this template retains the plan's five-tool application contract because it also owns the public event envelope, UI resource, idempotency records, and follow-up semantics.

## License

MIT
