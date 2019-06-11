import {ArrBuf} from "../../src";

describe("", () => {
    test("", () => {
        const arr = new Uint8Array([1, 2, 3, 4]);
        const res = ArrBuf.transfer(arr, 2);
        expect([...new Uint8Array(res)]).toEqual([1, 2]);
    });

    test("", () => {
        const arr = new Uint8Array([1, 2, 3, 4]);
        const res = ArrBuf.transfer(arr, 6);
        expect([...new Uint8Array(res)]).toEqual([1, 2, 3, 4, 0, 0]);
    });
});
