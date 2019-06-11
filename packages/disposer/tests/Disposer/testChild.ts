import {Disposer} from "../../src";

describe("", () => {
    const foo = {};
    const bar = {};

    const dfoo = Disposer.for(foo);
    const dbar = Disposer.for(bar);

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
        const dzoo = Disposer.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dfoo.addChild(dzoo);
        expect(dzoo.isDisposed()).toBe(true);
    });

    test("", () => {
        const zoo = {};
        const dzoo = Disposer.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dfoo.addChild(zoo);
        expect(dzoo.isDisposed()).toBe(true);
    });
});
