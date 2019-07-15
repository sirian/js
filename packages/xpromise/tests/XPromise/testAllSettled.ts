import {XPromise} from "../../src";

describe("Xpromise.allSettled", () => {
    const yes = (value: any) => ({status: "fulfilled", value});
    const no = (reason: any) => ({status: "rejected", reason});

    const a = {x: "a"};
    const b = {x: "b"};
    const c = {x: "c"};

    test("empty array", async () => {
        const result = await XPromise.allSettled([]);
        expect(result).toStrictEqual([]);
    });

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

    test("poisoned .then", async () => {
        const err = new Error("poisoned");
        const poisoned = new Promise(() => {});
        poisoned.then = () => { throw err; };

        const result = await XPromise.allSettled([poisoned, a]);
        expect(result).toStrictEqual([no(err), yes(a)]);
    });
});
