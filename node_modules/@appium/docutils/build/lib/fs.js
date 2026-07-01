"use strict";
/**
 * Functions which touch the filesystem
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMkDocsYml = exports.findPython = exports.findMike = exports.isMkDocsInstalled = exports.readJson = exports.readPackageJson = exports.findMkDocsYml = exports.stringifyJson = exports.stringifyYaml = void 0;
exports.findInPkgDir = findInPkgDir;
exports.writeFileString = writeFileString;
exports.requirePython = requirePython;
const support_1 = require("@appium/support");
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("./utils");
const YAML = __importStar(require("yaml"));
const constants_1 = require("./constants");
const error_1 = require("./error");
const logger_1 = require("./logger");
const teen_process_1 = require("teen_process");
const utils_2 = require("./utils");
const log = (0, logger_1.getLogger)('fs');
/**
 * Finds path to closest `package.json`
 *
 * Caches result
 */
const findPkgDir = support_1.util.memoize(utils_1.findPackageRoot);
/**
 * Stringifies a thing into a YAML
 * @param value Something to yamlify
 * @returns Some nice YAML 4 u
 */
const stringifyYaml = (value) => YAML.stringify(value, undefined, { indent: 2 });
exports.stringifyYaml = stringifyYaml;
/**
 * Pretty-stringifies a JSON value
 * @param value Something to stringify
 * @returns JSON string
 */
const stringifyJson = (value) => JSON.stringify(value, undefined, 2);
exports.stringifyJson = stringifyJson;
/**
 * Reads a YAML file, parses it and caches the result
 */
const readYaml = support_1.util.memoize(async (filepath) => YAML.parse(await support_1.fs.readFile(filepath, 'utf8'), {
    prettyErrors: false,
    logLevel: 'silent',
}));
/**
 * Finds a file from `cwd`. Searches up to the package root (dir containing `package.json`).
 *
 * @param filename Filename to look for
 * @param cwd Dir it should be in
 * @returns
 */
async function findInPkgDir(filename, cwd = process.cwd()) {
    try {
        return node_path_1.default.join(await findPkgDir(cwd), filename);
    }
    catch {
        return undefined;
    }
}
/**
 * Finds an `mkdocs.yml`, expected to be a sibling of `package.json`
 *
 * Caches the result.
 * @param cwd - Current working directory
 * @returns Path to `mkdocs.yml`
 */
exports.findMkDocsYml = support_1.util.memoize(async (cwd = process.cwd()) => await findInPkgDir(constants_1.NAME_MKDOCS_YML, cwd));
async function _readPkgJson(cwd, normalize) {
    let pkgDir;
    try {
        pkgDir = await findPkgDir(cwd);
    }
    catch {
        throw new error_1.DocutilsError(`Could not find a ${constants_1.NAME_PACKAGE_JSON} near ${cwd}; please create it before using this utility`);
    }
    const pkgPath = node_path_1.default.join(pkgDir, constants_1.NAME_PACKAGE_JSON);
    log.debug('Found `package.json` at %s', pkgPath);
    const pkg = await (0, utils_1.readPackage)({ cwd: pkgDir, normalize: normalize !== false });
    return { pkg, pkgPath };
}
/**
 * Given a directory to start from, reads a `package.json` file and returns its path and contents
 */
exports.readPackageJson = support_1.util.memoize(_readPkgJson);
/**
 * Reads a JSON file and parses it
 */
exports.readJson = support_1.util.memoize(async (filepath) => JSON.parse(await support_1.fs.readFile(filepath, 'utf8')));
/**
 * Writes contents to a file. Any JSON objects are stringified
 * @param filepath - Path to file
 * @param content - File contents
 */
function writeFileString(filepath, content) {
    const data = typeof content === 'string' ? content : JSON.stringify(content, undefined, 2);
    return support_1.fs.writeFile(filepath, data, {
        encoding: 'utf8',
    });
}
/**
 * `which` with memoization
 */
const cachedWhich = support_1.util.memoize(support_1.fs.which);
/**
 * Finds `python` executable
 */
const whichPython = async () => await cachedWhich(constants_1.NAME_PYTHON, { nothrow: true });
/**
 * Finds `python3` executable
 */
const whichPython3 = async () => await cachedWhich(`${constants_1.NAME_PYTHON}3`, { nothrow: true });
/**
 * Check if `mkdocs` is installed
 */
exports.isMkDocsInstalled = support_1.util.memoize(async () => {
    // see if it's in PATH
    const mkDocsPath = await cachedWhich(constants_1.NAME_MKDOCS, { nothrow: true });
    if (mkDocsPath) {
        return true;
    }
    // if it isn't, it should be invokable via `python -m`
    const pythonPath = await (0, exports.findPython)();
    if (!pythonPath) {
        return false;
    }
    try {
        await (0, teen_process_1.exec)(pythonPath, ['-m', constants_1.NAME_MKDOCS]);
        return true;
    }
    catch {
        return false;
    }
});
/**
 * `mike` cannot be invoked via `python -m`, so we need to find the script.
 */
const findMike = async () => {
    // see if it's in PATH
    let mikePath = await cachedWhich(constants_1.NAME_MIKE, { nothrow: true });
    if (mikePath) {
        return mikePath;
    }
    // if it isn't, it may be in a user dir
    const pythonPath = await (0, exports.findPython)();
    if (!pythonPath) {
        return;
    }
    try {
        // the user dir can be found this way.
        // usually it's something like ~/.local
        const { stdout } = await (0, teen_process_1.exec)(pythonPath, ['-m', 'site', '--user-base']);
        if (stdout) {
            mikePath = node_path_1.default.join(stdout.trim(), 'bin', 'mike');
            if (await support_1.fs.isExecutable(mikePath)) {
                return mikePath;
            }
        }
    }
    catch { }
};
exports.findMike = findMike;
/**
 * Finds the `python3` or `python` executable in the user's `PATH`.
 *
 * `python3` is preferred over `python`, since the latter could be Python 2.
 */
exports.findPython = support_1.util.memoize(async () => (await whichPython3()) ?? (await whichPython()));
/**
 * Check if a path to Python exists, otherwise raise DocutilsError
 */
async function requirePython(pythonPath) {
    const foundPythonPath = pythonPath ?? (await (0, exports.findPython)());
    if (!foundPythonPath) {
        throw new error_1.DocutilsError(constants_1.MESSAGE_PYTHON_MISSING);
    }
    return foundPythonPath;
}
/**
 * Reads an `mkdocs.yml` file, merges inherited configs, and returns the result. The result is cached.
 *
 * **IMPORTANT**: The paths of `site_dir` and `docs_dir` are resolved to absolute paths, since they
 * are expressed as relative paths, and each inherited config file can live in different paths.
 * @param filepath Patgh to an `mkdocs.yml` file
 * @returns Parsed `mkdocs.yml` file
 */
exports.readMkDocsYml = support_1.util.memoize(async (filepath, cwd = process.cwd()) => {
    let mkDocsYml = (await readYaml(filepath));
    if (mkDocsYml.site_dir) {
        mkDocsYml.site_dir = node_path_1.default.resolve(cwd, node_path_1.default.dirname(filepath), mkDocsYml.site_dir);
    }
    if (mkDocsYml.INHERIT) {
        let inheritPath = node_path_1.default.resolve(node_path_1.default.dirname(filepath), mkDocsYml.INHERIT);
        while (inheritPath) {
            const inheritYml = (await readYaml(inheritPath));
            if (inheritYml.site_dir) {
                inheritYml.site_dir = node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.site_dir);
                log.debug('Resolved site_dir to %s', inheritYml.site_dir);
            }
            if (inheritYml.docs_dir) {
                inheritYml.docs_dir = node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.docs_dir);
                log.debug('Resolved docs_dir to %s', inheritYml.docs_dir);
            }
            mkDocsYml = (0, utils_2.mergeDefaultsDeep)(mkDocsYml, inheritYml);
            inheritPath = inheritYml.INHERIT
                ? node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.INHERIT)
                : undefined;
        }
    }
    return mkDocsYml;
});
//# sourceMappingURL=fs.js.map