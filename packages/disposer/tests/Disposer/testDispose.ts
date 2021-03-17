import {DisposerManager} from "../../src";

describe("Disposer.dispose", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    test("Disposer preserves after disposing", () => {
        const o = {};
        const d1 = dm.for(o);
        dm.dispose(d1);
        expect(dm.for(o)).toBe(d1);
    });
});
