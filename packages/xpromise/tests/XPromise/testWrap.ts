import {XPromise} from "../../src";

test("XPromise.wrap", async () => {
    const value = {};
    const err = {};

    await expect(XPromise.wrap(() => value)).resolves.toBe(value);
    await expect(XPromise.wrap(() => { throw err; })).rejects.toBe(err);
});
