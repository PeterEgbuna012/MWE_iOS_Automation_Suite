import type { Item, ItemEncoding, Strongbox, Value } from '.';
/**
 * Base item implementation
 *
 * @remarks This class is not intended to be instantiated directly
 * @typeParam T - Type of data stored in the `Item`
 */
export declare class BaseItem<T extends Value, U extends Strongbox = Strongbox> implements Item<T> {
    readonly name: string;
    readonly encoding: ItemEncoding;
    /**
     * Parent Strongbox instance
     */
    readonly container: string;
    /**
     * Unique slugified identifier
     */
    readonly id: string;
    /**
     * {@inheritdoc Item.value}
     */
    readonly value: T | undefined;
    /**
     * {@inheritdoc Item.value}
     */
    protected _value?: T;
    /**
     * Slugifies the name
     * @param name Name of instance
     * @param parent Parent Strongbox
     * @param encoding Defaults to `utf8`
     */
    constructor(name: string, parent: U, encoding?: ItemEncoding);
    /**
     * Absolute filesystem path of the file backing an item: `container` + slugified `name`.
     * Also used to convert a `name` to an `id`.
     */
    static toFilePath(container: string, name: string): string;
    /**
     * {@inheritdoc Item.clear}
     */
    clear(): Promise<void>;
    /**
     * {@inheritdoc Item.read}
     */
    read(): Promise<T | undefined>;
    /**
     * {@inheritdoc Item.write}
     */
    write(value: T): Promise<void>;
}
//# sourceMappingURL=base-item.d.ts.map