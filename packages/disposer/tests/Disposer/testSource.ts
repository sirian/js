import {Disposer} from "../../src";

describe("", () => {
    const foo = {};
    const bar = {};

    const dFoo = Disposer.for(foo);
    const dBar = Disposer.for(bar);

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
        const dzoo = Disposer.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dzoo.addSource(foo);
        expect(dzoo.isDisposed()).toBe(true);
    });

    test("", () => {
        const zoo = {};
        const dzoo = Disposer.for(zoo);
        expect(dzoo.isDisposed()).toBe(false);
        dzoo.addSource(dFoo);
        expect(dzoo.isDisposed()).toBe(true);
    });
});
