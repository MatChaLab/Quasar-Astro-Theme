import type { AstroLogger } from '../../core/logger/core.js';
import type { Flags } from '../flags.js';
import { type LockFileData } from '../../core/dev/lockfile.js';
export interface BackgroundResult {
    pid: number;
    url: string;
    existing?: boolean;
}
export interface BackgroundErrorResult {
    error: string;
    message: string;
}
export declare function formatBackgroundOutput(result: BackgroundResult | BackgroundErrorResult): string;
/**
 * Build the human-readable message shown when a background dev server is running.
 * Lists every network address (when `--host` exposed any) so the output matches
 * the foreground dev server, then appends the management command hints.
 */
export declare function formatServerRunningMessage(data: LockFileData, { existing }?: {
    existing?: boolean;
}): string;
export declare function background({ flags, logger, }: {
    flags: Flags;
    logger: AstroLogger;
}): Promise<void>;
