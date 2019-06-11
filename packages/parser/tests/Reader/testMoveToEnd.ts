import {Reader} from "../../src";

test("testMoveToEnd", () => {
    const reader = new Reader("foobar");
    expect(reader.remainingLength).toBe(6);

    reader.moveToEnd();
    expect(reader.remainingLength).toBe(0);

    reader.moveToEnd();
    expect(reader.remainingLength).toBe(0);
});
