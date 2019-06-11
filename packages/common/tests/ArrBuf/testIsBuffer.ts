import {ArrBuf} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const falseData = [
        {},
        undefined,
        null,
        [],
        new DataView(new ArrayBuffer(10)),
    ];

    const trueData = [
        new Uint8Array().buffer,
        new ArrayBuffer(0),
    ];

    const data = Util.mergeData(trueData, falseData, true);

    test.each(data)("", (value, expected) => {
        expect(ArrBuf.isBuffer(value)).toBe(expected);
    });
});
