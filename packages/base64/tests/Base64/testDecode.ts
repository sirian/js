import {Base64} from "../../src";
import {data} from "./data";

const rev = data.map((pair) => pair.slice().reverse());

test.each(rev)("Base64.decode(%o) === %o", (value, expected) => {
    expect(Base64.decode(value).toString()).toBe(expected);
});
