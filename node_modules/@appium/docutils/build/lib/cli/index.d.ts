#!/usr/bin/env node
/**
 * Main CLI entry point for `@appium/docutils`
 * @module
 */
/**
 * Entry point for the docutils CLI.
 * @param argv Raw argv values (without node/bin by default).
 */
export declare function main(argv?: string[]): Promise<{
    [x: string]: unknown;
    verbose: boolean | undefined;
    logLevel: "debug" | "info" | "warn" | "error" | "silent";
    "log-level": "debug" | "info" | "warn" | "error" | "silent";
    config: string | undefined;
    noConfig: boolean | undefined;
    "no-config": boolean | undefined;
    _: (string | number)[];
    $0: string;
}>;
//# sourceMappingURL=index.d.ts.map