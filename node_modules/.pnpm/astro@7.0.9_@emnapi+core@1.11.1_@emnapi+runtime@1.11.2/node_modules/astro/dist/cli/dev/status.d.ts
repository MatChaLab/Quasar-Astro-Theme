import type { AstroLogger } from '../../core/logger/core.js';
import type { Flags } from '../flags.js';
export interface StatusResult {
    running: boolean;
    pid?: number;
    url?: string;
    port?: number;
    background?: boolean;
    uptime?: number;
}
export declare function formatStatusOutput(result: StatusResult): string;
export declare function status({ flags, logger, }: {
    flags: Flags;
    logger: AstroLogger;
}): Promise<void>;
