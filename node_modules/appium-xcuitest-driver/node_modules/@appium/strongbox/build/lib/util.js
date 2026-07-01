"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
/**
 * Produces a filesystem-safe slug from a string.
 * @param value Raw value.
 */
function slugify(value) {
    return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
//# sourceMappingURL=util.js.map