import type { AstroLogger } from '../../core/logger/core.js';
import type { Flags } from '../flags.js';
export interface StopResult {
    stopped: boolean;
    pid?: number;
    reason?: string;
}
export declare function formatStopOutput(result: StopResult): string;
export declare function stop({ flags, logger, }: {
    flags: Flags;
    logger: AstroLogger;
}): Promise<void>;
