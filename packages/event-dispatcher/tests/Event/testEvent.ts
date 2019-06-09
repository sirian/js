import {DataEvent} from "../../src";

test("", () => {
    const event = new DataEvent(3);

    expect(event.data).toBe(3);
});
