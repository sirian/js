import {AnyKey} from "./object";
import {Length, Tail} from "./tuple";
import {IsExact} from "./types";

export type NodeAncestors<T, K extends AnyKey> = Tail<NodeParents<T, K>>;

export type NodeParents<T, K extends AnyKey> =
    T extends object
    ? K extends keyof T
      ? T[K] extends infer V
        ? IsExact<T, V> extends true
          ? T[]
          : [T, ...NodeParents<V, K>]
        : never
      : [T]
    : [];

export type NodeDepth<T, K extends AnyKey> = Length<NodeAncestors<T, K>>;
