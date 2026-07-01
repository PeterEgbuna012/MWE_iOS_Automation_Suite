"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItem = exports.strongbox = exports.Strongbox = exports.DEFAULT_SUFFIX = void 0;
const env_paths_1 = __importDefault(require("env-paths"));
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const base_item_1 = require("./base-item");
Object.defineProperty(exports, "BaseItem", { enumerable: true, get: function () { return base_item_1.BaseItem; } });
const util_1 = require("./util");
/**
 * Set of known `Item` encodings
 * @internal
 */
const ITEM_ENCODINGS = new Set([
    'ascii',
    'utf8',
    'utf-8',
    'utf16le',
    'ucs2',
    'ucs-2',
    'base64',
    'base64url',
    'latin1',
    'binary',
    'hex',
    null,
]);
/**
 * Type guard for encodings
 * @param value any
 * @returns `true` is `value` is a valid file encoding
 */
function isEncoding(value) {
    return ITEM_ENCODINGS.has(value);
}
/**
 * Default container suffix if no explicit container is provided.
 *
 * @see {@linkcode StrongboxOpts}
 */
exports.DEFAULT_SUFFIX = 'strongbox';
/**
 * Main entry point for use of this module
 *
 * Manages multiple {@linkcode Item}s.
 */
class Strongbox {
    name;
    /**
     * Override the directory of this container.
     *
     * If this is present, `suffix` is ignored.
     */
    container;
    /**
     * Slugified name of this instance; corresponds to the directory name.
     *
     * If `dir` is provided, this value is unused.
     * If `suffix` is provided, then this will be the parent directory of `suffix`.
     */
    id;
    suffix;
    /**
     * Default {@linkcode ItemCtor} to use when creating new {@linkcode Item}s
     */
    defaultItemCtor;
    /**
     * Store of known {@linkcode Item}s
     * @internal
     */
    items;
    /**
     * Slugifies the name & determines the directory
     * @param name Name of instance
     * @param opts Options
     */
    constructor(name, opts = {}) {
        this.name = name;
        this.id = (0, util_1.slugify)(name);
        let newOpts = this.setDefaultOptions(opts);
        newOpts = this.checkOptions(newOpts);
        this.defaultItemCtor = newOpts.defaultItemCtor;
        this.container = newOpts.container;
        this.suffix = newOpts.suffix;
        this.items = new Map();
    }
    /**
     * Creates a new {@linkcode Strongbox}
     * @param name Name of instance
     * @param opts Options
     * @returns New instance
     */
    static create(name, opts) {
        return new Strongbox(name, opts);
    }
    /**
     * Clears _all_ items.
     *
     * @param force - If `true`, will rimraf the container. Otherwise, will only delete individual items.
     */
    async clearAll(force = false) {
        const items = [...this.items.values()].map((ref) => ref.deref()).filter(Boolean);
        await Promise.all(items.map((item) => item.clear()));
        if (force) {
            await (0, promises_1.rm)(this.container, { recursive: true });
        }
    }
    async createItem(name, encodingOrCtor, encoding) {
        if (isEncoding(encodingOrCtor)) {
            encoding = encodingOrCtor;
            encodingOrCtor = this.defaultItemCtor;
        }
        const item = new (encodingOrCtor ?? this.defaultItemCtor)(name, this, encoding);
        if (this.getLiveItem(item.id)) {
            throw new ReferenceError(`Item with id "${item.id}" already exists`);
        }
        try {
            await item.read();
        }
        catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
        this.items.set(item.id, new WeakRef(item));
        return item;
    }
    async createItemWithValue(name, value, encodingOrCtor, encoding) {
        const item = isEncoding(encodingOrCtor)
            ? await this.createItem(name, encodingOrCtor)
            : await this.createItem(name, encodingOrCtor, encoding);
        await item.write(value);
        return item;
    }
    /**
     * Attempts to retrieve an {@linkcode Item} by its `id`.
     * Drops stale {@linkcode WeakRef} map entries when the value was collected.
     * @param id ID of item
     * @returns An `Item`, if found
     */
    getItem(id) {
        return this.getLiveItem(id);
    }
    /**
     * Lists persisted items by scanning the container directory (one regular file per item).
     *
     * Filenames are matched to items by path; if an item was already registered (e.g. via
     * {@linkcode Strongbox.createItem}), that instance is returned and keeps its original `name`.
     * Otherwise a new item is created using the filename as `name` (see {@linkcode BaseItem}).
     *
     * @remarks Builds one array of every {@linkcode Item} reference. Does not read file contents;
     * call {@linkcode Item.read} on each item as needed. Order follows directory iteration
     * ({@linkcode opendir}), not lexicographic sort. For many items, `for await (const item of box)`
     * ({@linkcode Symbol.asyncIterator}) streams entries without allocating a full {@linkcode Item}[]
     * first.
     *
     * @returns Items in directory iteration order; empty if the container directory does not exist yet
     */
    async listItems() {
        const items = [];
        for await (const basename of this.iterateFileBasenames()) {
            items.push(this.resolveItemForBasename(basename));
        }
        return items;
    }
    /**
     * Yields each persisted item in the same order as {@linkcode Strongbox.listItems}. Use
     * `for await (const item of box)`.
     *
     * @remarks Walks the container with {@linkcode opendir} and yields one {@linkcode Item} per file
     * as basenames are seen (no full-name buffer and no sort).
     */
    async *[Symbol.asyncIterator]() {
        for await (const basename of this.iterateFileBasenames()) {
            yield this.resolveItemForBasename(basename);
        }
    }
    /**
     * Performs runtime validation (and optionally transformation) of options.
     *
     * Should not set defaults.
     *
     * The default implementation slugifies any custom container name and suffix.
     *
     * Subclasses should override this method to perform additional validation as needed.
     * @param opts - Options
     */
    checkOptions(opts) {
        opts.suffix = (0, util_1.slugify)(opts.suffix);
        if (opts.container) {
            opts.container = opts.container.split(node_path_1.default.sep).map(util_1.slugify).join(node_path_1.default.sep);
            if (!node_path_1.default.isAbsolute(opts.container)) {
                throw new TypeError(`container slug ${opts.container} must be an absolute path`);
            }
        }
        else {
            opts.container = node_path_1.default.join((0, env_paths_1.default)(this.id).data, opts.suffix);
        }
        return opts;
    }
    /**
     * Sets defaults for options.
     *
     * Subclasses should override as necessary.
     * @param opts Options
     * @returns Options with defaults applied
     */
    setDefaultOptions(opts = {}) {
        const newOpts = opts;
        newOpts.suffix = opts.suffix ?? exports.DEFAULT_SUFFIX;
        newOpts.defaultItemCtor = opts.defaultItemCtor ?? base_item_1.BaseItem;
        return newOpts;
    }
    /**
     * Returns a live {@linkcode Item} or removes a stale {@linkcode WeakRef} from {@linkcode Strongbox.items}.
     */
    getLiveItem(id) {
        const ref = this.items.get(id);
        if (!ref) {
            return undefined;
        }
        const item = ref.deref();
        if (!item) {
            this.items.delete(id);
            return undefined;
        }
        return item;
    }
    /**
     * Streams regular-file basenames from the container using {@linkcode opendir} (order is
     * filesystem-defined, not sorted).
     */
    async *iterateFileBasenames() {
        let dir;
        try {
            dir = await (0, promises_1.opendir)(this.container);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return;
            }
            throw e;
        }
        for await (const ent of dir) {
            if (ent.isFile()) {
                yield ent.name;
            }
        }
    }
    /**
     * Registers an {@linkcode Item} for a filename on disk without reading the file (see
     * {@linkcode Strongbox.createItem}, which loads persisted contents eagerly). Uses the same
     * constructor arity as {@linkcode Strongbox.createItem} when no encoding is given.
     */
    registerItemWithoutRead(name) {
        const item = new this.defaultItemCtor(name, this, undefined);
        if (this.getLiveItem(item.id)) {
            throw new ReferenceError(`Item with id "${item.id}" already exists`);
        }
        this.items.set(item.id, new WeakRef(item));
        return item;
    }
    resolveItemForBasename(basename) {
        const id = base_item_1.BaseItem.toFilePath(this.container, basename);
        return this.getItem(id) ?? this.registerItemWithoutRead(basename);
    }
}
exports.Strongbox = Strongbox;
/**
 * {@inheritdoc Strongbox.create}
 */
exports.strongbox = Strongbox.create;
//# sourceMappingURL=index.js.map