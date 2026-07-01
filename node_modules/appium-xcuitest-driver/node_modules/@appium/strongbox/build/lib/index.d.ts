import { BaseItem } from './base-item';
/**
 * Valid file encodings.
 *
 * `null` means the file should be read and written as a `Buffer`.
 */
export type ItemEncoding = BufferEncoding | null;
/**
 * Valid value wrapped by {@linkcode Item}. Can be an encoded string or `Buffer`
 */
export type Value = string | Buffer;
/**
 * An object representing a persisted item containing something of type `T` (which can be a {@linkcode Buffer} or an encoded string; see {@linkcode ItemEncoding}).
 *
 * A {@linkcode Item} does not know anything about where it is stored, or how it is stored.
 * @typeParam T - Type of data stored in the item
 */
export interface Item<T extends Value> {
    /**
     * Encoding of underlying value
     */
    encoding: ItemEncoding;
    /**
     * Slugified name
     */
    id: string;
    /**
     * Name of item
     */
    name: string;
    /**
     * Last known value (stored in memory)
     *
     * @remarks A custom {@linkcode Item} meant to handle very large files should probably not implement this.
     */
    value?: T;
    /**
     * Deletes the item.
     */
    clear(): Promise<void>;
    /**
     * Reads value
     */
    read(): Promise<T | undefined>;
    /**
     * Writes value
     * @param value New value
     */
    write(value: T): Promise<void>;
}
/**
 * Default container suffix if no explicit container is provided.
 *
 * @see {@linkcode StrongboxOpts}
 */
export declare const DEFAULT_SUFFIX = "strongbox";
/**
 * A constructor function which instantiates a {@linkcode Item}.
 */
export type ItemCtor<T extends Value, U extends StrongboxOpts = StrongboxOpts, V extends Strongbox<U> = Strongbox<U>> = new (name: string, parent: V, encoding?: ItemEncoding) => Item<T>;
/**
 * Options for {@linkcode strongbox}
 */
export interface StrongboxOpts {
    /**
     * Override default container, which is chosen according to environment.
     *
     * This must be a writable path.
     */
    container: string;
    /**
     * Default {@linkcode Item} constructor.
     *
     * Unless a constructor is specified when calling {@linkcode Strongbox.createItem} or {@linkcode Strongbox.createItemWithValue}, this will be used.
     * @defaultValue BaseItem
     */
    defaultItemCtor: ItemCtor<any>;
    /**
     * Extra subdir to append to the auto-generated file directory hierarchy.
     *
     * This is ignored if `container` is provided.
     * @defaultValue 'strongbox'
     */
    suffix: string;
}
/**
 * Main entry point for use of this module
 *
 * Manages multiple {@linkcode Item}s.
 */
export declare class Strongbox<Options extends StrongboxOpts = StrongboxOpts> implements AsyncIterable<Item<any>> {
    readonly name: string;
    /**
     * Override the directory of this container.
     *
     * If this is present, `suffix` is ignored.
     */
    readonly container: string;
    /**
     * Slugified name of this instance; corresponds to the directory name.
     *
     * If `dir` is provided, this value is unused.
     * If `suffix` is provided, then this will be the parent directory of `suffix`.
     */
    readonly id: string;
    readonly suffix: string;
    /**
     * Default {@linkcode ItemCtor} to use when creating new {@linkcode Item}s
     */
    protected defaultItemCtor: ItemCtor<any>;
    /**
     * Slugifies the name & determines the directory
     * @param name Name of instance
     * @param opts Options
     */
    protected constructor(name: string, opts?: Partial<Options>);
    /**
     * Creates a new {@linkcode Strongbox}
     * @param name Name of instance
     * @param opts Options
     * @returns New instance
     */
    static create<Options extends StrongboxOpts = StrongboxOpts>(name: string, opts?: Partial<Options>): Strongbox<Options>;
    /**
     * Clears _all_ items.
     *
     * @param force - If `true`, will rimraf the container. Otherwise, will only delete individual items.
     */
    clearAll(force?: boolean): Promise<void>;
    /**
     * Create a new {@linkcode Item}.
     *
     * Reads the item, if it is already persisted. Does not throw if missing.
     * @param name Unique name of item
     * @param encoding Encoding of item; defaults to `utf8`
     * @returns New `Item`
     * @typeParam T - Type of data stored in the `Item`
     */
    createItem<T extends Value>(name: string, ctor?: ItemCtor<T>, encoding?: ItemEncoding): Promise<Item<T>>;
    createItem<T extends Value>(name: string, encoding?: ItemEncoding): Promise<Item<T>>;
    /**
     * Creates a {@linkcode Item} then immediately writes value to it.
     *
     * If it exists already, it will be overwritten.
     * @param name Name of `Item`
     * @param value File value to write
     * @param ctor Specific {@linkcode ItemCtor} to use
     * @param encoding File encoding
     * @returns New `Item` w/ value of `value`
     */
    createItemWithValue<T extends Value>(name: string, value: T, ctor: ItemCtor<T>, encoding?: ItemEncoding): Promise<Item<T>>;
    createItemWithValue<T extends Value>(name: string, value: T, encoding?: ItemEncoding): Promise<Item<T>>;
    /**
     * Attempts to retrieve an {@linkcode Item} by its `id`.
     * Drops stale {@linkcode WeakRef} map entries when the value was collected.
     * @param id ID of item
     * @returns An `Item`, if found
     */
    getItem(id: string): Item<any> | undefined;
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
    listItems(): Promise<Item<any>[]>;
    /**
     * Yields each persisted item in the same order as {@linkcode Strongbox.listItems}. Use
     * `for await (const item of box)`.
     *
     * @remarks Walks the container with {@linkcode opendir} and yields one {@linkcode Item} per file
     * as basenames are seen (no full-name buffer and no sort).
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<Item<any>>;
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
    protected checkOptions(opts: Options): Options;
    /**
     * Sets defaults for options.
     *
     * Subclasses should override as necessary.
     * @param opts Options
     * @returns Options with defaults applied
     */
    protected setDefaultOptions(opts?: Partial<Options>): Options;
    /**
     * Returns a live {@linkcode Item} or removes a stale {@linkcode WeakRef} from {@linkcode Strongbox.items}.
     */
    private getLiveItem;
    /**
     * Streams regular-file basenames from the container using {@linkcode opendir} (order is
     * filesystem-defined, not sorted).
     */
    private iterateFileBasenames;
    /**
     * Registers an {@linkcode Item} for a filename on disk without reading the file (see
     * {@linkcode Strongbox.createItem}, which loads persisted contents eagerly). Uses the same
     * constructor arity as {@linkcode Strongbox.createItem} when no encoding is given.
     */
    private registerItemWithoutRead;
    private resolveItemForBasename;
}
/**
 * {@inheritdoc Strongbox.create}
 */
export declare const strongbox: typeof Strongbox.create;
/**
 * This can be subclassed if needed.
 */
export { BaseItem };
//# sourceMappingURL=index.d.ts.map