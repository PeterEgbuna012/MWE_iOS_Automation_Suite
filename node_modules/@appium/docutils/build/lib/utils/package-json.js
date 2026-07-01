"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPackageRoot = findPackageRoot;
exports.findPackageRootSync = findPackageRootSync;
exports.readPackage = readPackage;
const support_1 = require("@appium/support");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const normalize_package_data_1 = __importDefault(require("normalize-package-data"));
/** Finds the directory containing the nearest `package.json` by walking upward from `dir`. */
async function findPackageRoot(dir) {
    assertNonEmptyDir(dir, 'findPackageRoot');
    let current = node_path_1.default.resolve(dir);
    const fsRoot = node_path_1.default.parse(current).root;
    while (true) {
        if (await support_1.fs.exists(node_path_1.default.join(current, 'package.json'))) {
            return current;
        }
        if (current === fsRoot) {
            throwPackageRootNotFound(dir);
        }
        current = node_path_1.default.dirname(current);
    }
}
/** Finds the project root directory from `dir`. */
function findPackageRootSync(dir) {
    assertNonEmptyDir(dir, 'findPackageRootSync');
    let current = node_path_1.default.resolve(dir);
    const fsRoot = node_path_1.default.parse(current).root;
    while (true) {
        if (node_fs_1.default.existsSync(node_path_1.default.join(current, 'package.json'))) {
            return current;
        }
        if (current === fsRoot) {
            throwPackageRootNotFound(dir);
        }
        current = node_path_1.default.dirname(current);
    }
}
async function readPackage(options = {}) {
    const { cwd, normalize = true } = options;
    const contents = await support_1.fs.readFile(getPackagePath(cwd), 'utf8');
    return parsePackageJson(contents, normalize);
}
function assertNonEmptyDir(dir, fnName) {
    if (!dir) {
        throw new TypeError(`\`${fnName}()\` must be provided a non-empty path`);
    }
}
function throwPackageRootNotFound(dir) {
    throw new Error(`Could not find \`package.json\` from ${dir}`);
}
function getPackagePath(cwd) {
    return node_path_1.default.resolve(cwd ?? process.cwd(), 'package.json');
}
function parsePackageJson(contents, normalize = true) {
    const json = JSON.parse(contents);
    if (normalize === false) {
        return json;
    }
    (0, normalize_package_data_1.default)(json);
    return json;
}
//# sourceMappingURL=package-json.js.map