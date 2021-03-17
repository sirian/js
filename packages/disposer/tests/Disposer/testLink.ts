import {DisposerManager} from "../../src";

describe("Disposer.link", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    test("Disposer.link", () => {

        const stack: any[] = [];
        dm.on("dispose", (t, d) => stack.push(t));

        let x = 0;
        const o1 = {x: x++};
        const o2 = {x: x++};
        const o3 = {x: x++};
        const o4 = {x: x++};
        const o5 = {x: x++};

        dm.link(o1, o2, o3);

        dm.dispose(o2);

        expect(stack).toStrictEqual([o2, o1, o3]);

        dm.link(o4, o2, o5);

        expect(stack).toStrictEqual([o2, o1, o3, o4, o5]);
    });
});
