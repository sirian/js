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
