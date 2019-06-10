import {AppendIterator} from "../../src";

test("", () => {
    const it = new AppendIterator([[1, 2], [3, 4]]);
    expect([...it]).toStrictEqual([1, 2, 3, 4]);
});
