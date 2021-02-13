import {Base64} from "../../src";
import {data} from "./data";

const rev = [];
for (let [str, b64] of data) {
    rev.push([b64, str]);
    while (b64.endsWith("=")) {
        b64 = b64.slice(0, -1);
        rev.push([b64, str]);
    }
}

test.each(rev)("Base64.decode(%o) === %o", (value, expected) => {
    expect(Base64.decode(value, true)).toBe(expected);
});
