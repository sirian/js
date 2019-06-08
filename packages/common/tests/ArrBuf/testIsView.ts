import {ArrBuf} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const falseData = [
        {},
        undefined,
        null,
        [],
        new ArrayBuffer(0),
    ];

    const trueData = [
        new Uint8Array(),
        new Uint16Array(),
        new DataView(new ArrayBuffer(0)),
    ];

    const data = Util.mergeData(trueData, falseData, true);

    test.each(data)("", (value, expected) => {
        expect(ArrBuf.isView(value)).toBe(expected);
    });
});
