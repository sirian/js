import {SortIterator} from "../../src/SortIterator";

test("", () => {
    const it = new SortIterator(["foo", "bar", "baz"], (a, b) => a.localeCompare(b));

    expect([...it]).toEqual(["bar", "baz", "foo"]);
});
