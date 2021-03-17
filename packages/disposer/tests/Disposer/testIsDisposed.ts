import {DisposerManager} from "../../src";

test("", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);
    const foo = {};
    const d = dm.for(foo);
    expect(d.isDisposed()).toBe(false);
    d.dispose();
    expect(d.isDisposed()).toBe(true);
});
