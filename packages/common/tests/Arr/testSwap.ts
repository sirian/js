import {swap} from "../../src";

test("swap()", () => {
    const a = [1, 2, 3];
    swap(a, 0, 1);
    expect(a).toStrictEqual([2, 1, 3]);
    swap(a, 0, 2);
    expect(a).toStrictEqual([3, 1, 2]);
    swap(a, 2, 2);
    expect(a).toStrictEqual([3, 1, 2]);
    swap(a, 2, 1);
    expect(a).toStrictEqual([3, 2, 1]);
    swap(a, 2, 1);
    expect(a).toStrictEqual([3, 1, 2]);
});
