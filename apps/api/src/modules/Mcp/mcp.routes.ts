import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { Router } from "express";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { mcpTokenService } from "./mcp.service";
import { createMcpServer } from "./mcp.tools";

const router = Router();

// Sengaja hanya menerima Personal Access Token (bukan JWT) dan hanya di /mcp,
// sehingga token yang bocor tidak bisa dipakai ke endpoint lain (password, profil, dll).
router.all(
  "/",
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const userId = token ? await mcpTokenService.verify(token) : null;
    if (!userId) {
      return next(new AppError("Unauthorized: invalid API token", 401));
    }

    // Stateless: server + transport baru per request
    const server = createMcpServer(userId);
    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }),
);

export default router;
