import {Reader} from "../../src";

test("testMoveForward", () => {
    const reader = new Reader("foobar");
    expect(reader.remainingLength).toBe(6);
    reader.moveForward(3);
    expect(reader.remainingLength).toBe(3);
    reader.moveForward(2);
    expect(reader.remainingLength).toBe(1);
    reader.moveForward(5);
    expect(reader.remainingLength).toBe(0);
});
