import {Disposer} from "../../src";

describe("callback", () => {
    test("", () => {
        const foo = {};
        const d = Disposer.for(foo);

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

        Disposer.for(o).onDispose(() => {
            actual.push(1);
            Disposer.for(o).onDispose(() => {
                actual.push(2);
            });
            actual.push(3);
        });

        Disposer.for(o).dispose();

        expect(actual).toStrictEqual([1, 2, 3]);
    });

    test("throws", async () => {
        const foo = {};

        const results: any[] = [];

        const onError = jest.fn();
        Disposer.once("error", onError);

        const err = new Error("foo");

        const errCallback = () => { throw err; };

        const disposer = Disposer.for(foo)
            .onDisposed(() => results.push(3))
            .onDispose(() => results.push(1))
            .onDispose(errCallback)
            .onDispose(() => results.push(2))
        ;

        expect(results).toStrictEqual([]);
        expect(Disposer.isDisposed(foo)).toBe(false);

        expect(() => Disposer.dispose(foo)).not.toThrow();
        expect(Disposer.isDisposed(foo)).toBe(true);
        expect(results).toStrictEqual([1, 2, 3]);
        expect(onError).toHaveBeenCalledWith(err, disposer, errCallback);
    });

});
