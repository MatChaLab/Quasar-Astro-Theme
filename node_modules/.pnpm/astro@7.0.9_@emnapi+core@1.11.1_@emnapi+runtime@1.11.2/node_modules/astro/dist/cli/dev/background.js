import { spawn } from "node:child_process";
import { existsSync, mkdirSync, openSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  checkExistingServer,
  getLogFileURL,
  readLockFile,
  removeLockFile,
  isProcessAlive,
  killDevServer
} from "../../core/dev/lockfile.js";
import { resolveRoot } from "../../core/config/config.js";
const require2 = createRequire(import.meta.url);
function formatBackgroundOutput(result) {
  return JSON.stringify(result);
}
function formatServerRunningMessage(data, { existing = false } = {}) {
  const lines = [
    `Dev server ${existing ? "already running" : "running"} at ${data.url} (pid ${data.pid})`
  ];
  if (data.urls && data.urls.network.length > 0) {
    lines.push("  Network:");
    for (const url of data.urls.network) {
      lines.push(`    ${url}`);
    }
  }
  lines.push("  Stop:   astro dev stop", "  Status: astro dev status", "  Logs:   astro dev logs");
  return lines.join("\n");
}
async function background({
  flags,
  logger
}) {
  const root = pathToFileURL(resolveRoot(flags.root) + "/");
  const existing = checkExistingServer(root);
  if (existing && !flags.force) {
    logger.info("SKIP_FORMAT", formatServerRunningMessage(existing, { existing: true }));
    return;
  }
  if (existing && flags.force) {
    await killDevServer(root, existing);
  }
  const args = ["dev"];
  if (flags.port) args.push("--port", String(flags.port));
  if (flags.host != null) {
    if (typeof flags.host === "string") {
      args.push("--host", flags.host);
    } else {
      args.push("--host");
    }
  }
  if (flags.config) args.push("--config", String(flags.config));
  if (flags.root) args.push("--root", String(flags.root));
  if (flags.allowedHosts) args.push("--allowed-hosts", String(flags.allowedHosts));
  if (flags.json) args.push("--json");
  const logFileURL = getLogFileURL(root);
  const logFilePath = fileURLToPath(logFileURL);
  const dotAstroDir = fileURLToPath(new URL(".astro/", root));
  if (!existsSync(dotAstroDir)) {
    mkdirSync(dotAstroDir, { recursive: true });
  }
  const logFd = openSync(logFilePath, "w");
  const rootPath = fileURLToPath(root);
  const astroBin = resolve(dirname(require2.resolve("astro/package.json")), "bin", "astro.mjs");
  const child = spawn(process.execPath, [astroBin, ...args], {
    detached: true,
    stdio: ["ignore", logFd, logFd],
    cwd: rootPath,
    env: { ...process.env, ASTRO_DEV_BACKGROUND: "1" }
  });
  child.unref();
  const childPid = child.pid;
  if (!childPid) {
    logger.error("SKIP_FORMAT", "Failed to spawn background dev server process.");
    process.exit(1);
  }
  const timeout = 3e4;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (!isProcessAlive(childPid)) {
      logger.error("SKIP_FORMAT", "Dev server process exited before becoming ready.");
      process.exit(1);
    }
    const lockData = readLockFile(root);
    if (lockData && lockData.pid === childPid) {
      logger.info("SKIP_FORMAT", formatServerRunningMessage(lockData));
      return;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  try {
    process.kill(childPid, "SIGTERM");
  } catch {
  }
  removeLockFile(root);
  logger.error("SKIP_FORMAT", `Dev server failed to start within ${timeout / 1e3}s.`);
  process.exit(1);
}
export {
  background,
  formatBackgroundOutput,
  formatServerRunningMessage
};
