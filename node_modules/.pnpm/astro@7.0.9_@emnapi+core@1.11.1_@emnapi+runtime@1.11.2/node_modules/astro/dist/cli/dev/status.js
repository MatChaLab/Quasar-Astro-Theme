import { pathToFileURL } from "node:url";
import { checkExistingServer } from "../../core/dev/lockfile.js";
import { resolveRoot } from "../../core/config/config.js";
function formatStatusOutput(result) {
  return JSON.stringify(result);
}
async function status({
  flags,
  logger
}) {
  const root = pathToFileURL(resolveRoot(flags.root) + "/");
  const existing = checkExistingServer(root);
  if (!existing) {
    logger.info("SKIP_FORMAT", "No dev server is running.");
    return;
  }
  const startedAt = new Date(existing.startedAt).getTime();
  const uptime = Math.floor((Date.now() - startedAt) / 1e3);
  const lines = [
    `Dev server running at ${existing.url} (pid ${existing.pid}, uptime ${uptime}s${existing.background ? ", background" : ""})`
  ];
  if (existing.urls && existing.urls.network.length > 0) {
    lines.push("  Network:");
    for (const url of existing.urls.network) {
      lines.push(`    ${url}`);
    }
  }
  logger.info("SKIP_FORMAT", lines.join("\n"));
}
export {
  formatStatusOutput,
  status
};
