import {Cons, Length, Tail} from "./tuple";
import {IsExact} from "./types";

export type NodePath<T, K = "parent"> =
    K extends keyof T
    ? IsExact<T, T[K]> extends true
      ? T[]
      : Cons<T, NodePath<T[K]>>
    : T extends object
      ? [T]
      : [];

export type NodeDepth<T, K = "parent"> = Length<Tail<NodePath<T, K>>>;
