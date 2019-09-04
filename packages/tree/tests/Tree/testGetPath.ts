import {Tree} from "../../src";

describe("getPath", () => {
    class Node {
        public static id = 1;
        public id: number;

        constructor(public parent?: any) {
            this.id = Node.id++;
        }
    }

    const root = new Node();
    const c1 = new Node(root);
    const c2 = new Node(c1);

    const selfParent = new Node();
    selfParent.parent = selfParent;

    const cycled1 = new Node();
    const cycled2 = new Node();
    cycled1.parent = cycled2;
    cycled2.parent = cycled1;

    const nullNode = new Node(null);

    const data: Array<[any, any[]]> = [
        [root, [root]],
        [c1, [c1, root]],
        [c2, [c2, c1, root]],
        [selfParent, [selfParent]],
        [cycled1, [cycled1, cycled2]],
        [cycled2, [cycled2, cycled1]],
        [nullNode, [nullNode]],
    ];

    test.each(data)("Tree.getPath(%o) === %o", (node, expected) => {
        const path = Tree.getPath(node);
        expect(path).toStrictEqual(expected);
        expect(Tree.getDepth(node)).toStrictEqual(expected.length - 1);
    });
});
