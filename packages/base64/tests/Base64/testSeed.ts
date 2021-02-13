import {TestUtil} from "../../../common/tests/TestUtil";
import {Base64} from "../../src";

describe("Random strings", () => {
    const data = TestUtil.randStrings(20, 0, 50);

    test.each(data)("encode/decode %p", (str) => {
        const expected = Buffer.from(str).toString("base64");
        const encoded = Base64.encode(str, true);
        const decoded = Base64.decode(encoded, true);
        expect(encoded).toBe(expected);
        expect(decoded).toBe(str);
    });
});
