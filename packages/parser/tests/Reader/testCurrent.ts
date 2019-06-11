import {Reader} from "../../src";

test("testCurrent", () => {
    const reader = new Reader("foobar");

    expect(reader.current).toBe("f");

    reader.moveForward(3);
    expect(reader.current).toBe("b");

    reader.moveForward(1);
    expect(reader.current).toBe("a");

    reader.moveToEnd();
    expect(reader.current).toBe(undefined);
});
