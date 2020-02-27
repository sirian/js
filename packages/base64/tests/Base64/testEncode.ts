import {Base64} from "../../src";
import {data} from "./data";

test.each(data)("Base64.encode(%o) === %o", (value, expected) => {
    expect(Base64.encode(value).toString()).toBe(expected);
});
