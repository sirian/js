import {makeArray} from "@sirian/common";
import {getAncestors} from "../../src/Tree";

describe("getAncestors", () => {
    const nodes = makeArray(5, (i) => ({name: i, parent: null as any}));
    nodes.reduce((a, b) => Object.assign(b, {parent: a}));

    const data = nodes.map((node) => [node.name, node] as const);

    test.each(data)("getAncestors(%d)", (depth, node) => {
        const parents = nodes.slice(0, node.name).reverse();
        expect(getAncestors(node, "parent")).toStrictEqual(parents);
    });
});
