import {makeArray} from "@sirian/common";
import {getParents} from "../../src/Tree";

describe("getParents", () => {
    const nodes = makeArray(5, (i) => ({name: i, parent: null as any}));
    nodes.reduce((a, b) => Object.assign(b, {parent: a}));

    const data = nodes.map((node) => [node.name, node] as const);

    test.each(data)("getParents(%d)", (depth, node) => {
        const parents = nodes.slice(0, node.name + 1).reverse();
        expect(getParents(node, "parent")).toStrictEqual(parents);
    });
});
