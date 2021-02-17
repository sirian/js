import {Func} from "./function";
import {NotFunc, Primitive} from "./types";

export interface Lengthwise<L extends number = number> {
    length: L;
}

export interface Sizeable<L extends number = number> {
    size(): L;
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

export interface Thenable {
    then: Func;
}

export type NotThenable = Primitive | object & { then?: NotFunc };
