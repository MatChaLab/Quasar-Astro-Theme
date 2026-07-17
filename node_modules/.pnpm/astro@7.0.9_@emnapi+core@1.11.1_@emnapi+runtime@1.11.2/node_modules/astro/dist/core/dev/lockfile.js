import { existsSync, readFileSync, unlinkSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const GRACEFUL_SHUTDOWN_TIMEOUT = 5e3;
function getLockFileURL(root) {
  return new URL(".astro/dev.json", root);
}
function getLogFileURL(root) {
  return new URL(".astro/dev.log", root);
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function isResolvedServerUrls(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { local, network } = value;
  return isStringArray(local) && isStringArray(network);
}
function parseLockFile(content) {
  try {
    const data = JSON.parse(content);
    if (typeof data.pid !== "number" || typeof data.port !== "number" || typeof data.url !== "string" || typeof data.background !== "boolean" || typeof data.startedAt !== "string") {
      return null;
    }
    if (data.urls !== void 0 && !isResolvedServerUrls(data.urls)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
function serializeLockFile(data) {
  return JSON.stringify(data, null, "	");
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function readLockFile(root) {
  const lockFileURL = getLockFileURL(root);
  try {
    const content = readFileSync(lockFileURL, "utf-8");
    return parseLockFile(content);
  } catch {
    return null;
  }
}
function writeLockFile(root, data) {
  const lockFileURL = getLockFileURL(root);
  const dirPath = fileURLToPath(new URL(".astro/", root));
  try {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(lockFileURL, serializeLockFile(data), "utf-8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to write lock file: ${message}`);
  }
}
function removeLockFile(root) {
  const lockFileURL = getLockFileURL(root);
  try {
    unlinkSync(lockFileURL);
  } catch (err) {
    if (err?.code !== "ENOENT") {
      throw err;
    }
  }
}
function evaluateExistingServer(data, alive) {
  if (data === null) {
    return null;
  }
  return { data, stale: !alive };
}
async function killDevServer(root, data) {
  try {
    process.kill(data.pid, "SIGTERM");
  } catch {
  }
  const deadline = Date.now() + GRACEFUL_SHUTDOWN_TIMEOUT;
  while (Date.now() < deadline) {
    if (!isProcessAlive(data.pid)) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (isProcessAlive(data.pid)) {
    try {
      process.kill(data.pid, "SIGKILL");
    } catch {
    }
  }
  removeLockFile(root);
}
function checkExistingServer(root) {
  const data = readLockFile(root);
  const result = evaluateExistingServer(data, data !== null && isProcessAlive(data.pid));
  if (result === null) {
    return null;
  }
  if (result.stale) {
    removeLockFile(root);
    return null;
  }
  return result.data;
}
export {
  GRACEFUL_SHUTDOWN_TIMEOUT,
  checkExistingServer,
  evaluateExistingServer,
  getLogFileURL,
  isProcessAlive,
  killDevServer,
  parseLockFile,
  readLockFile,
  removeLockFile,
  serializeLockFile,
  writeLockFile
};
