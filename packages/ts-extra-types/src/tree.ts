import {Cons, Length, Tail} from "./tuple";
import {IfExact} from "./types";

export type NodePath<T, K = "parent"> =
    K extends keyof T
    ? {
        0: T[]
        1: Cons<T, NodePath<T[K]>>;
    }[IfExact<T, T[K], 0, 1>]
    : [T];

export type NodeDepth<T, K = "parent"> = Length<Tail<NodePath<T, K>>>;
