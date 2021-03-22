import {XPromise} from "../../src";

test("XPromise.wrap", () => {
    const value = {};
    const err = {};

    expect(XPromise.wrap(() => value)).resolves.toBe(value);
    expect(XPromise.wrap(() => { throw err; })).rejects.toBe(err);
});
