import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const agentSessions = pgTable(
  "agent_session",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    ownerUserId: text("owner_user_id").notNull(),
    eveSessionId: text("eve_session_id"),
    encryptedContinuationToken: text("encrypted_continuation_token"),
    cachedStatus: text("cached_status").notNull(),
    lastObservedEventIndex: integer("last_observed_event_index")
      .notNull()
      .default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("agent_session_owner_idx").on(table.workspaceId, table.ownerUserId),
    uniqueIndex("agent_session_eve_id_idx").on(table.eveSessionId),
  ],
);

export const agentOperations = pgTable(
  "agent_operation",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull(),
    ownerUserId: text("owner_user_id").notNull(),
    agentSessionId: text("agent_session_id").references(() => agentSessions.id),
    kind: text("kind").notNull(),
    clientRequestId: text("client_request_id").notNull(),
    status: text("status").notNull(),
    safeErrorCode: text("safe_error_code"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("agent_operation_idempotency_idx").on(
      table.workspaceId,
      table.ownerUserId,
      table.kind,
      table.clientRequestId,
    ),
  ],
);
