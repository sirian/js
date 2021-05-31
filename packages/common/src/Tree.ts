import {NodeAncestors, NodeParents, Nullish} from "@sirian/ts-extra-types";
import {isNullish} from "./Is";

export const getParents = <T, K extends keyof T>(node: T | Nullish, key: K): NodeParents<T, K> =>
    isNullish(node) ? [] : [node, ...getAncestors(node, key)] as any;

export const getAncestors = <T, K extends keyof T>(node: T | Nullish, key: K): NodeAncestors<T, K> => {
    const parent = node?.[key] as any;
    return parent === node || isNullish(parent) ? [] : [parent, ...getAncestors(parent, key)] as any;
};
