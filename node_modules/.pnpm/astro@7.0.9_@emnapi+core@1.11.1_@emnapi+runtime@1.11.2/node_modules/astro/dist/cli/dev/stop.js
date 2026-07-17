import { pathToFileURL } from "node:url";
import { checkExistingServer, killDevServer } from "../../core/dev/lockfile.js";
import { resolveRoot } from "../../core/config/config.js";
function formatStopOutput(result) {
  return JSON.stringify(result);
}
async function stop({
  flags,
  logger
}) {
  const root = pathToFileURL(resolveRoot(flags.root) + "/");
  const existing = checkExistingServer(root);
  if (!existing) {
    logger.info("SKIP_FORMAT", "No dev server is running.");
    return;
  }
  await killDevServer(root, existing);
  logger.info("SKIP_FORMAT", `Stopped dev server (pid ${existing.pid}).`);
}
export {
  formatStopOutput,
  stop
};
