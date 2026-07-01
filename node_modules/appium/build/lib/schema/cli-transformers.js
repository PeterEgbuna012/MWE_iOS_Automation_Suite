"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformers = void 0;
exports.parseCsvLine = parseCsvLine;
const argparse_1 = require("argparse");
const node_fs_1 = require("node:fs");
/**
 * This module provides transformer functions for CLI arguments.
 *
 * Use case: config schemas can accept richer types (arrays/objects), but CLI
 * values are strings. Transformers convert string input into those richer types.
 */
/**
 * Splits a CSV string into an array
 */
function parseCsvLine(value) {
    return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
}
exports.transformers = {
    /**
     * Given a CSV-style string or pathname, parse it into an array.
     * The file can also be split on newlines.
     */
    csv: (csvOrPath) => {
        let csv = csvOrPath;
        let loadedFromFile = false;
        // Value could be a single CSV token or a filepath; attempt file first.
        if ((0, node_fs_1.existsSync)(csvOrPath)) {
            try {
                csv = (0, node_fs_1.readFileSync)(csvOrPath, 'utf8');
            }
            catch (err) {
                throw new argparse_1.ArgumentTypeError(`Could not read file '${csvOrPath}': ${err.message}`);
            }
            loadedFromFile = true;
        }
        try {
            return loadedFromFile ? parseCsvFile(csv) : parseCsvLine(csv);
        }
        catch (err) {
            const msg = loadedFromFile
                ? `The provided value of '${csvOrPath}' must be a valid CSV`
                : `Must be a comma-delimited string, e.g., "foo,bar,baz"`;
            throw new TypeError(`${msg}. Original error: ${err.message}`, { cause: err });
        }
    },
    /**
     * Parse a string which could be a path to a JSON file or a JSON string.
     */
    json: (jsonOrPath) => {
        let json = jsonOrPath;
        let loadedFromFile = false;
        if ((0, node_fs_1.existsSync)(jsonOrPath)) {
            try {
                // Intentionally sync: argparse type hooks are synchronous.
                json = (0, node_fs_1.readFileSync)(jsonOrPath, 'utf8');
            }
            catch (err) {
                throw new argparse_1.ArgumentTypeError(`Could not read file '${jsonOrPath}': ${err.message}`);
            }
            loadedFromFile = true;
        }
        try {
            return JSON.parse(json);
        }
        catch (e) {
            const msg = loadedFromFile
                ? `'${jsonOrPath}' must be a valid JSON`
                : `The provided value must be a valid JSON`;
            throw new TypeError(`${msg}. Original error: ${e.message}`, { cause: e });
        }
    },
};
/**
 * Split a file by newline then calls {@link parseCsvLine} on each line.
 */
function parseCsvFile(value) {
    return value
        .split(/\r?\n/)
        .map((v) => v.trim())
        .filter(Boolean)
        .flatMap(parseCsvLine);
}
//# sourceMappingURL=cli-transformers.js.map