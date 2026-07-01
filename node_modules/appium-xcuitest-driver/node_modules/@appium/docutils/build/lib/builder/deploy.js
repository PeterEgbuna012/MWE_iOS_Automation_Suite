"use strict";
/**
 * Functions for running `mike`
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = deploy;
exports.findDeployVersion = findDeployVersion;
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = require("../constants");
const error_1 = require("../error");
const fs_1 = require("../fs");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const log = (0, logger_1.getLogger)('builder:deploy');
/**
 * Runs `mike build` or `mike serve`
 * @param opts Options
 */
async function deploy({ mkdocsYml: mkDocsYmlPath, packageJson: packageJsonPath, deployVersion: version, usePrefixedMajorDeployVersion: usePrefixedMajorVersion, cwd = process.cwd(), serve = false, push = false, branch = constants_1.DEFAULT_DEPLOY_BRANCH, remote = constants_1.DEFAULT_DEPLOY_REMOTE, deployPrefix, message, alias, aliasType = constants_1.DEFAULT_DEPLOY_ALIAS_TYPE, port = constants_1.DEFAULT_SERVE_PORT, host = constants_1.DEFAULT_SERVE_HOST, serveOpts, execOpts, } = {}) {
    const stop = (0, utils_1.stopwatch)('deploy');
    await (0, fs_1.requirePython)();
    const mkdocsInstalled = await (0, fs_1.isMkDocsInstalled)();
    if (!mkdocsInstalled) {
        throw new error_1.DocutilsError(`Could not find MkDocs executable; please run "${constants_1.NAME_BIN} init"`);
    }
    mkDocsYmlPath = mkDocsYmlPath ?? (await (0, fs_1.findMkDocsYml)(cwd));
    if (!mkDocsYmlPath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_MKDOCS_YML} from ${cwd}; please run "${constants_1.NAME_BIN} init"`);
    }
    version = version ?? (await findDeployVersion(packageJsonPath, usePrefixedMajorVersion, cwd));
    // substitute %s in message with version
    message = message?.replace('%s', version);
    const mikeOpts = {
        'config-file': mkDocsYmlPath,
        push,
        remote,
        branch,
        'deploy-prefix': deployPrefix,
        message,
        port,
        host,
    };
    const mikePath = await (0, fs_1.findMike)();
    if (!mikePath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_MIKE} executable; please run "${constants_1.NAME_BIN} init"`);
    }
    if (serve) {
        const mikeArgs = [
            ...(0, utils_1.argify)(Object.fromEntries(Object.entries(mikeOpts).filter(([, value]) => typeof value === 'number' || Boolean(value)))),
        ];
        stop(); // discard
        // unsure about how SIGHUP is handled here
        await doServe(mikePath, mikeArgs, serveOpts);
    }
    else {
        log.info('Deploying into branch %s', branch);
        const mikeArgs = [
            ...(0, utils_1.argify)(Object.fromEntries(Object.entries(mikeOpts).filter(([key, value]) => !['port', 'host'].includes(key) && (typeof value === 'number' || Boolean(value))))),
        ];
        if (alias) {
            mikeArgs.push('--update-aliases', '--alias-type', aliasType);
            mikeArgs.push(version, alias);
        }
        else {
            mikeArgs.push(version);
        }
        await doDeploy(mikePath, mikeArgs, execOpts);
        log.success('Finished deployment into branch %s (%dms)', branch, stop());
    }
}
/**
 * Runs `mike serve`
 * @param mikePath Path to `mike` executable
 * @param args Extra args to `mike build`
 * @param opts Extra options for `teen_process.Subprocess.start`
 */
async function doServe(mikePath, args = [], opts = {}) {
    const finalArgs = ['serve', ...args];
    log.debug('Executing %s via: %s %O', constants_1.NAME_MIKE, mikePath, finalArgs);
    return (0, utils_1.spawnBackgroundProcess)(mikePath, finalArgs, opts);
}
/**
 * Runs `mike build`
 * @param mikePath Path to `mike` executable
 * @param args Extra args to `mike build`
 * @param opts Extra options to `teen_process.exec`
 */
async function doDeploy(mikePath, args = [], opts = {}) {
    const finalArgs = ['deploy', ...args];
    log.debug('Executing %s via: %s %O', constants_1.NAME_MIKE, mikePath, finalArgs);
    return await (0, utils_1.execWithErrorHandling)(mikePath, finalArgs, opts);
}
/**
 * Derives a deployment version from `package.json`
 * @param packageJsonPath Path to `package.json` if known
 * @param usePrefixedMajorVersion Whether to extract a v-prefixed major version
 * @param cwd Current working directory
 */
async function findDeployVersion(packageJsonPath, usePrefixedMajorVersion, cwd = process.cwd()) {
    const { pkg } = await (0, fs_1.readPackageJson)(packageJsonPath ? node_path_1.default.dirname(packageJsonPath) : cwd, true);
    const version = pkg.version;
    if (!version) {
        throw new error_1.DocutilsError('No "version" field found in package.json; please add one or specify a version to deploy');
    }
    // If a minor version can be extracted, use MAJOR.MINOR as the deploy version, otherwise use MAJOR.
    // If usePrefixedMajorVersion is true, always use vMAJOR
    const versionParts = version.split('.');
    if (versionParts.length === 1) {
        return usePrefixedMajorVersion ? `v${version}` : version;
    }
    return usePrefixedMajorVersion ? `v${versionParts[0]}` : `${versionParts[0]}.${versionParts[1]}`;
}
//# sourceMappingURL=deploy.js.map