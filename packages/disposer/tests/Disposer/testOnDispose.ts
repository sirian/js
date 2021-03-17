import {DisposerManager} from "../../src";

describe("callback", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    test("", () => {
        const foo = {};
        const d = dm.for(foo);

        const results: number[] = [];
        d.onDispose(() => results.push(1));
        d.onDispose(() => results.push(2));

        expect(results).toStrictEqual([]);

        d.dispose();

        expect(results).toStrictEqual([1, 2]);

        d.dispose();

        expect(results).toStrictEqual([1, 2]);
    });

    test("add callback inside another callback", () => {
        const o = {};
        const actual: number[] = [];

        dm.for(o).onDispose(() => {
            actual.push(1);
            dm.for(o).onDispose(() => {
                actual.push(2);
            });
            actual.push(3);
        });

        dm.for(o).dispose();

        expect(actual).toStrictEqual([1, 2, 3]);
    });

    test("throws", async () => {
        const dm2 = new DisposerManager();

        const foo = {};

        const results: any[] = [];

        const onError = jest.fn();
        dm2.on("error", onError);

        const err = new Error("foo");

        const errCallback = () => { throw err; };

        const disposer = dm2.for(foo)
            .onDisposed(() => results.push(3))
            .onDispose(() => results.push(1))
            .onDispose(errCallback)
            .onDispose(() => results.push(2))
        ;

        expect(results).toStrictEqual([]);
        expect(dm2.isDisposed(foo)).toBe(false);

        expect(() => dm2.dispose(foo)).not.toThrow();
        expect(dm2.isDisposed(foo)).toBe(true);
        expect(results).toStrictEqual([1, 2, 3]);
        expect(onError).toHaveBeenCalledWith(err, foo, disposer, errCallback);
    });

});
