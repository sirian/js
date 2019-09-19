import {Disposer} from "../../src";

describe("Disposer.addCallback", () => {
    test("Disposer.addCallback", () => {
        const fn = jest.fn();
        Disposer.events.addListener("dispose", fn);

        const o1 = {};
        const o2 = {};

        const d1 = Disposer.for(o1);
        const d2 = Disposer.for(o2);

        Disposer.dispose(o1);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenLastCalledWith(o1, d1);

        Disposer.dispose(o2, o1);

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith(o2, d2);

        Disposer.events.removeListener("dispose", fn);
    });
});
