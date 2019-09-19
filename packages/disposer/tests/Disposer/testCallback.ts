import {Disposer} from "../../src";

describe("callback", () => {
    test("", () => {
        const foo = {};
        const dfoo = Disposer.for(foo);

        const results: number[] = [];
        dfoo.addCallback(() => results.push(1));
        dfoo.addCallback(() => results.push(2));

        expect(results).toStrictEqual([]);

        dfoo.dispose();

        expect(results).toStrictEqual([1, 2]);

        dfoo.dispose();

        expect(results).toStrictEqual([1, 2]);
    });

    test("throws", async () => {
        const foo = {};

        const results: any[] = [];

        const onError = jest.fn();
        Disposer.events.once("error", onError);

        const err = new Error("foo");

        const disposer = Disposer.for(foo)
            .addCallback(() => results.push(1))
            .addCallback(() => { throw err; })
            .addCallback(() => results.push(2))
            .addCallback(() => results.push(3))
        ;

        expect(results).toStrictEqual([]);
        expect(Disposer.isDisposed(foo)).toBe(false);

        expect(() => Disposer.dispose(foo)).not.toThrow();
        expect(Disposer.isDisposed(foo)).toBe(true);
        expect(results).toStrictEqual([1, 2, 3]);
        expect(onError).toHaveBeenCalledWith(err, foo, disposer);
    });

});
