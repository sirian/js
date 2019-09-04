import {NodeDepth, NodePath} from "@sirian/ts-extra-types";

export class Tree {
    public static getDepth<T, K = "parent">(node: T, key?: K): NodeDepth<T, K>;
    public static getDepth(node: any, key = "parent") {
        return this.getPath(node, key).length - 1;
    }

    public static getPath<T, K = "parent">(n: T, key?: K): NodePath<T, K>;
    public static getPath(node: any, key = "parent") {
        const set = new Set();

        while (node && !set.has(node)) {
            set.add(node);
            node = node[key];
        }

        return [...set];
    }
}
