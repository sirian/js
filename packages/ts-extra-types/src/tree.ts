import {Length, Tail} from "./tuple";
import {IsExact} from "./types";

export type NodePath<T, K = "parent"> =
    T extends object
    ? K extends keyof T
      ? T[K] extends infer V
        ? IsExact<T, V> extends true
          ? T[]
          : [T, ...NodePath<V, K>]
        : never
      : [T]
    : [];

export type NodeDepth<T, K = "parent"> = Length<Tail<NodePath<T, K>>>;
