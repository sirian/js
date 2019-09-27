import {Disposer} from "../../src";

describe("Disposer.link", () => {
    test("Disposer.link", () => {

        const stack: any[] = [];
        Disposer.on("dispose", (target) => stack.push(target));

        let x = 0;
        const o1 = {x: x++};
        const o2 = {x: x++};
        const o3 = {x: x++};
        const o4 = {x: x++};
        const o5 = {x: x++};

        Disposer.link(o1, o2, o3);

        Disposer.dispose(o2);

        expect(stack).toStrictEqual([o2, o1, o3]);

        Disposer.link(o4, o2, o5);

        expect(stack).toStrictEqual([o2, o1, o3, o4, o5]);

        Disposer.removeAllListeners();
    });
});
