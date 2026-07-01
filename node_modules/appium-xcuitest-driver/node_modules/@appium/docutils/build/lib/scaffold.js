"use strict";
/**
 * Implementation of a generic "create and/or update some file" task
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScaffoldTask = createScaffoldTask;
const support_1 = require("@appium/support");
const logger_1 = require("./logger");
const node_path_1 = __importDefault(require("node:path"));
const diff_1 = require("diff");
const error_1 = require("./error");
const utils_1 = require("./utils");
const fs_1 = require("./fs");
const constants_1 = require("./constants");
const log = (0, logger_1.getLogger)('init');
const dryRunLog = (0, logger_1.getLogger)('dry-run', log);
/**
 * Factory for a {@linkcode ScaffoldTask}.
 *
 * @param defaultFilename Default file to create
 * @param defaultContent Default content to use
 * @param description Description of task
 * @param opts Options
 * @returns A scaffold task
 */
function createScaffoldTask(defaultFilename, defaultContent, description, { transform = (content) => content, deserialize = JSON.parse, serialize = fs_1.stringifyJson, } = {}) {
    return async ({ overwrite = false, cwd = process.cwd(), packageJson: packageJsonPath, dest, dryRun = false, ...opts }) => {
        const relativePath = (0, utils_1.relative)(cwd);
        const { pkgPath, pkg } = await (0, fs_1.readPackageJson)(packageJsonPath ? node_path_1.default.dirname(packageJsonPath) : cwd, true);
        const pkgDir = node_path_1.default.dirname(pkgPath);
        dest = dest ?? node_path_1.default.join(pkgDir, defaultFilename);
        const relativeDest = relativePath(dest);
        log.debug('Initializing %s', relativeDest);
        let destChangesNeeded = false;
        let isNew = false;
        let destContent;
        let result;
        try {
            destContent = deserialize(await support_1.fs.readFile(dest, 'utf8'));
            log.debug('Found existing file %s', relativeDest);
        }
        catch (e) {
            const err = e;
            if (err.code !== constants_1.NAME_ERR_ENOENT) {
                throw err;
            }
            destChangesNeeded = true;
            log.debug('Creating new file %s', relativeDest);
            destContent = {};
            isNew = true;
        }
        const defaults = transform(defaultContent, opts, pkg);
        const finalDestContent = (0, utils_1.mergeDefaultsDeep)(destContent, defaults);
        destChangesNeeded = destChangesNeeded || !support_1.util.isEqual(destContent, finalDestContent);
        if (destChangesNeeded) {
            log.info('Changes needed in %s', relativeDest);
            log.debug('Original %s: %O', relativeDest, destContent);
            log.debug('Final %s: %O', relativeDest, finalDestContent);
            const patch = makePatch(dest, destContent, finalDestContent, serialize);
            if (dryRun) {
                dryRunLog.info('Would apply the following patch: \n\n%s', patch);
                result = { path: dest, content: finalDestContent };
                return result;
            }
            if (!isNew && !overwrite) {
                log.info('File %s already exists, continuing (enable overwrite with "--force")', relativeDest);
                log.debug('Tried to apply patch:\n\n%s', patch);
            }
            else {
                try {
                    await (0, fs_1.writeFileString)(dest, finalDestContent);
                    if (isNew) {
                        log.success('Initialized %s', description);
                    }
                    else {
                        log.success('Updated %s', description);
                    }
                }
                catch (e) {
                    const err = e;
                    throw new error_1.DocutilsError(`Could not write to ${relativeDest}. Reason: ${err.message}`, {
                        cause: err,
                    });
                }
            }
        }
        else {
            log.info('No changes necessary for %s', relativeDest);
        }
        log.success(`${description}: done`);
        return { path: dest, content: finalDestContent };
    };
}
/**
 * Creates a unified patch for display in "dry run" mode
 * @param filename - File name to use
 * @param oldData - Old data
 * @param newData - New Data
 * @returns Patch string
 */
function makePatch(filename, oldData, newData, serializer = fs_1.stringifyJson) {
    return (0, diff_1.createPatch)(filename, typeof oldData === 'string' ? oldData : serializer(oldData), typeof newData === 'string' ? newData : serializer(newData));
}
//# sourceMappingURL=scaffold.js.map