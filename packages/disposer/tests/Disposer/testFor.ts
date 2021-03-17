import {DisposerManager} from "../../src";

test("", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);
    const foo = {};
    const d = dm.for(foo);
    expect(dm.for(foo)).toBe(d);
    d.dispose();
    expect(dm.for(foo)).toBe(d);
});
