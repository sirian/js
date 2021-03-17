import {DisposerManager} from "../../src";

describe("", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    const foo = {};
    const bar = {};

    const dFoo = dm.for(foo);
    const dBar = dm.for(bar);

    dBar.addSource(foo);

    test("", () => {
        expect(dFoo.isDisposed()).toBe(false);
        expect(dBar.isDisposed()).toBe(false);
    });

    test("", () => {
        dFoo.dispose();

        expect(dFoo.isDisposed()).toBe(true);
        expect(dBar.isDisposed()).toBe(true);
    });

    test("", () => {

        const zoo = {};
        const dzoo = dm.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dzoo.addSource(foo);
        expect(dzoo.isDisposed()).toBe(true);
    });

    test("", () => {
        const zoo = {};
        const dzoo = dm.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dzoo.addSource(dFoo);
        expect(dzoo.isDisposed()).toBe(true);
    });
});
