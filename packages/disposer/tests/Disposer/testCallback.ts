import {Disposer} from "../../src";

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

test("throws", () => {
    const foo = {};

    const results: any[] = [];

    Disposer.for(foo)
        .addCallback(() => results.push(1))
        .addCallback(() => { throw new Error("bar"); })
        .addCallback(() => results.push(2))
    ;

    expect(results).toStrictEqual([]);
    expect(Disposer.isDisposed(foo)).toBe(false);

    Disposer.dispose(foo);

    expect(Disposer.isDisposed(foo)).toBe(true);
    expect(results).toStrictEqual([1, 2]);
    expect(Disposer.for(foo).errors).toStrictEqual([new Error("bar")]);
});
