import {Reader} from "../../src";

test("testIndexOf", () => {
    const reader = new Reader("foobar");

    expect(reader.indexOf("bar")).toBe(3);

    reader.moveForward(2);
    expect(reader.indexOf("bar")).toBe(1);

    reader.moveForward(2);
    expect(reader.indexOf("bar")).toBe(-1);
});
