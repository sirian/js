export interface Lengthwise {
    length: number;
}
export interface Sizeable {
    size(): number;
}
export interface IterableEntries<E = any> {
    entries(): IterableIterator<E>;
}
export interface IterableKeys<K = any> {
    keys(): IterableIterator<K>;
}
export interface IterableValues<V = any> {
    values(): IterableIterator<V>;
}
export interface Nextable<T = any> {
    next(): T;
}
//# sourceMappingURL=interfaces.d.ts.map