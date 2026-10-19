import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { blockerLogService } from "../Blocker-logs/blockerLog.service";
import { projectService } from "../Projects/project.service";
import { taskService } from "../Tasks/task.service";

const priority = z.enum(["High", "Medium", "Low"]);
const status = z.enum(["Pending", "Active", "Done"]);

// Hasil service → teks JSON untuk AI. Error (mis. "unauthorized") dikembalikan sebagai isError agar AI bisa memperbaiki langkahnya.
async function run(fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result ?? "OK") },
      ],
    };
  } catch (err) {
    return {
      content: [{ type: "text" as const, text: (err as Error).message }],
      isError: true,
    };
  }
}

// Ringkas task agar hemat token AI
const slimTask = (t: {
  id: string;
  title: string;
  status?: string;
  priority?: string;
  note?: string;
  project_id: string;
  created_at: string;
  completed_at?: string | null;
}) => ({
  id: t.id,
  title: t.title,
  status: t.status,
  priority: t.priority,
  note: t.note,
  project_id: t.project_id,
  created_at: t.created_at,
  completed_at: t.completed_at,
});

/** Server MCP baru per request; userId di-closure sehingga setiap tool hanya bisa menyentuh data user ini. */
export function createMcpServer(userId: string): McpServer {
  const server = new McpServer({ name: "stillbuilding", version: "1.0.0" });

  server.registerTool(
    "list_projects",
    {
      description:
        "List the user's StillBuilding projects. Use this to find a project_id before creating tasks or blocker logs.",
      inputSchema: z.object({}),
    },
    () =>
      run(async () =>
        (await projectService.getAll(userId)).map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
        })),
      ),
  );

  server.registerTool(
    "list_tasks",
    {
      description:
        "List the user's tasks, optionally filtered by status and/or project_id. Sorted Active > Pending > Done, then by priority.",
      inputSchema: z.object({
        status: status.optional(),
        project_id: z.string().optional(),
      }),
    },
    ({ status, project_id }) =>
      run(async () =>
        (await taskService.getAll(userId))
          .filter((t) => !status || t.status === status)
          .filter((t) => !project_id || t.project_id === project_id)
          .map(slimTask),
      ),
  );

  server.registerTool(
    "create_task",
    {
      description:
        "Create a new task in one of the user's projects. Call list_projects first to get a valid project_id.",
      inputSchema: z.object({
        project_id: z.string(),
        title: z.string().min(1),
        note: z.string().optional(),
        priority: priority.default("Medium"),
      }),
    },
    (input) =>
      run(async () =>
        slimTask(
          await taskService.create({ ...input, status: "Pending" }, userId),
        ),
      ),
  );

  server.registerTool(
    "update_task",
    {
      description:
        "Update a task's title, note, priority, or status. Set status to 'Done' to complete it, 'Active' to make it the current focus task (only one task can be Active).",
      inputSchema: z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        note: z.string().optional(),
        priority: priority.optional(),
        status: status.optional(),
      }),
    },
    ({ id, ...changes }) =>
      run(async () => {
        const completed_at = changes.status
          ? changes.status === "Done"
            ? new Date().toISOString()
            : null
          : undefined;
        return slimTask(
          await taskService.update(id, userId, { ...changes, completed_at }),
        );
      }),
  );

  server.registerTool(
    "delete_task",
    {
      description: "Permanently delete a task by id.",
      inputSchema: z.object({ id: z.string() }),
    },
    ({ id }) =>
      run(async () => {
        await taskService.delete(id, userId);
        return `Task ${id} deleted`;
      }),
  );

  server.registerTool(
    "create_blocker_log",
    {
      description:
        "Log a blocker (something preventing progress) on one of the user's projects, optionally with a solution.",
      inputSchema: z.object({
        project_id: z.string(),
        reason: z.string().min(1),
        solution: z.string().optional(),
      }),
    },
    (input) =>
      run(async () => {
        const log = await blockerLogService.create(
          { ...input, is_resolved: !!input.solution },
          userId,
        );
        return { id: log.id, reason: log.reason, solution: log.solution };
      }),
  );

  return server;
}
