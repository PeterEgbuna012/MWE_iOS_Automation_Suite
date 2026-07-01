"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_FIXTURES_DIR = void 0;
const node_path_1 = __importDefault(require("node:path"));
/**
 * Absolute path to bundled legacy test fixture static files.
 *
 * @deprecated Removed in Appium 4. Test fixture files will live in the appium/test-fixtures
 * repository. Do not depend on this path in driver CI — hard-copy needed files locally.
 */
exports.TEST_FIXTURES_DIR = resolveTestFixturesDir();
function resolveTestFixturesDir() {
    const fromDir = __dirname;
    const parts = node_path_1.default.resolve(fromDir).split(node_path_1.default.sep);
    const baseDriverIndex = parts.indexOf('base-driver');
    if (baseDriverIndex < 0) {
        throw new Error(`Could not find the module root folder in the path: ${fromDir}`);
    }
    return node_path_1.default.join(parts.slice(0, baseDriverIndex + 1).join(node_path_1.default.sep), 'test-fixtures', 'static');
}
//# sourceMappingURL=static-dir.js.map