import {DisposerManager} from "../../src";

describe("", () => {
    const foo = {};
    const bar = {};
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    const dfoo = dm.for(foo);
    const dbar = dm.for(bar);

    dfoo.addChild(bar);

    test("", () => {
        expect(dfoo.isDisposed()).toBe(false);
        expect(dbar.isDisposed()).toBe(false);
    });

    test("", () => {
        dfoo.dispose();

        expect(dfoo.isDisposed()).toBe(true);
        expect(dbar.isDisposed()).toBe(true);
    });

    test("", () => {
        const zoo = {};
        const dzoo = dm.for(zoo);
        expect(dfoo.isDisposed()).toBe(true);
        expect(dzoo.isDisposed()).toBe(false);
        dfoo.addChild(dzoo);
        expect(dzoo.isDisposed()).toBe(true);
    });

    test("", () => {
        const zoo = {};
        const dzoo = dm.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dfoo.addChild(zoo);
        expect(dzoo.isDisposed()).toBe(true);
    });
});
