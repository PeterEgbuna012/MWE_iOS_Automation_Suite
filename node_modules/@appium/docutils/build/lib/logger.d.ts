/**
 * It's a logger.
 *
 * Since this is a CLI app only, it doesn't necessarily make sense to consume `@appium/support`'s logger.
 *
 * @module
 */
declare const LogLevel: any;
import { LogLevelMap } from './constants';
/**
 * Type guard to see if a string is a recognized log level
 * @param level any value
 */
export declare function isLogLevelString(level: any): level is keyof typeof LogLevelMap;
/**
 * Returns a tagged logger, creating and caching one if needed.
 * @param tag Logger tag.
 * @param parent Parent logger to derive from.
 */
export declare function getLogger(tag: string, parent?: any): any;
export declare const initLogger: (level: keyof typeof LogLevelMap | typeof LogLevel) => void;
export {};
//# sourceMappingURL=logger.d.ts.map