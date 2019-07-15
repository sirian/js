import {XPromise} from "../../src";

describe("Xpromise.allSettled", () => {
    const yes = (value: any) => ({status: "fulfilled", value});
    const no = (reason: any) => ({status: "rejected", reason});

    const a = {x: "a"};
    const b = {x: "b"};
    const c = {x: "c"};

    test("no promise values", async () => {
        const result = await XPromise.allSettled([a, b, c]);

        expect(result).toStrictEqual([yes(a), yes(b), yes(c)]);
    });

    test("all fulfilled", async () => {
        const result = await XPromise.allSettled([Promise.resolve(a), Promise.resolve(b), Promise.resolve(c)]);
        expect(result).toStrictEqual([yes(a), yes(b), yes(c)]);
    });

    test("all rejected", async () => {
        const result = await XPromise.allSettled([
            Promise.reject(a),
            Promise.reject(b),
            Promise.reject(c),
        ]);
        expect(result).toStrictEqual([
            no(a),
            no(b),
            no(c),
        ]);
    });

    test("mixed", async () => {
        const result = await XPromise.allSettled([a, Promise.resolve(b), Promise.reject(c)]);
        expect(result).toStrictEqual([
            yes(a),
            yes(b),
            no(c),
        ]);
    });
});
