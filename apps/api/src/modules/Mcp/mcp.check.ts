// Self-check MCP: jalankan dengan `npx tsx src/modules/Mcp/mcp.check.ts` (butuh .env Supabase)
import assert from "node:assert/strict";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import express from "express";
import mcpRoutes from "./mcp.routes";
import { hashToken, mcpTokenService } from "./mcp.service";
import { createMcpServer } from "./mcp.tools";

const rpc = (method: string, id = 1) =>
  JSON.stringify({ jsonrpc: "2.0", id, method, params: {} });
const headers = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
};

async function main() {
  // 1. Hash deterministik & token palsu ditolak
  assert.equal(hashToken("abc"), hashToken("abc"));
  assert.notEqual(hashToken("abc"), hashToken("abd"));
  assert.equal(await mcpTokenService.verify("not_a_pat"), null);
  assert.equal(await mcpTokenService.verify("sb_pat_fake"), null);

  const app = express();
  app.use(express.json());
  app.use("/mcp", mcpRoutes);
  // Route uji tanpa auth untuk memastikan protokol & 6 tools terdaftar
  app.post("/mcp-test", async (req, res) => {
    const server = createMcpServer("00000000-0000-0000-0000-000000000000");
    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });
  app.use(
    (
      err: { statusCode?: number },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      res.status(err.statusCode ?? 500).end();
    },
  );
  const srv = app.listen(0);
  const port = (srv.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}`;

  try {
    // 2. Tanpa token / token palsu → 401
    let r = await fetch(`${base}/mcp`, {
      method: "POST",
      headers,
      body: rpc("tools/list"),
    });
    assert.equal(r.status, 401);
    r = await fetch(`${base}/mcp`, {
      method: "POST",
      headers: { ...headers, authorization: "Bearer sb_pat_fake" },
      body: rpc("tools/list"),
    });
    assert.equal(r.status, 401);

    // 3. Protokol MCP: tools/list mengembalikan 6 tools
    r = await fetch(`${base}/mcp-test`, {
      method: "POST",
      headers,
      body: rpc("tools/list"),
    });
    const text = await r.text();
    for (const name of [
      "list_projects",
      "list_tasks",
      "create_task",
      "update_task",
      "delete_task",
      "create_blocker_log",
    ]) {
      assert.ok(text.includes(`"${name}"`), `missing tool ${name}: ${text}`);
    }
    console.log("MCP self-check OK");
  } finally {
    srv.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
