import {AppendIterator} from "../../src";

test("", async () => {
    const it = new AppendIterator([[1, 2], [3, 4]]);
    expect(await it.toArray()).toStrictEqual([1, 2, 3, 4]);
});
