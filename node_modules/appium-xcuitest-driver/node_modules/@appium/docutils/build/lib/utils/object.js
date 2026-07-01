"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringArray = void 0;
exports.mergeDefaultsDeep = mergeDefaultsDeep;
const support_1 = require("@appium/support");
/**
 * Type guard to narrow an array to a string array
 * @param value any value
 * @returns `true` if the array is `string[]`
 */
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
exports.isStringArray = isStringArray;
/**
 * Performs a deep "defaults" merge into a clone of `target`.
 * Only undefined properties in `target` are filled from `defaults`.
 * @param target Destination object
 * @param defaults Default values object
 * @returns Merged clone
 */
function mergeDefaultsDeep(target, defaults) {
    const out = structuredClone(target);
    const stack = [
        { dest: out, src: defaults },
    ];
    while (stack.length) {
        const next = stack.pop();
        if (!next) {
            continue;
        }
        const { dest, src } = next;
        for (const [key, srcVal] of Object.entries(src)) {
            const destVal = dest[key];
            if (destVal === undefined) {
                dest[key] = structuredClone(srcVal);
                continue;
            }
            if (support_1.util.isPlainObject(destVal) && support_1.util.isPlainObject(srcVal)) {
                stack.push({ dest: destVal, src: srcVal });
            }
        }
    }
    return out;
}
//# sourceMappingURL=object.js.map