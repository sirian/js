import {Disposer} from "../../src";

describe("Disposer.addCallback", () => {
    test("Disposer.addCallback", () => {
        const fn = jest.fn();
        Disposer.addCallback(fn);

        const o1 = {};
        const o2 = {};

        Disposer.dispose(o1);

        Disposer.for(o1).addCallback(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(o1);

        Disposer.dispose(o2, o1);

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith(o2);
    });
});
