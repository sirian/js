import {Timeout} from "../../src";

describe("Timeout.active", () => {
    test("", async () => {
        jest.useFakeTimers();

        const fn = jest.fn();
        const t = Timeout.create(11, fn);

        expect(fn).not.toHaveBeenCalled();
        expect(t.isScheduled()).toBe(false);

        t.start();

        for (let i = 0; i < 10; i++) {
            jest.advanceTimersByTime(1);
            expect(fn).not.toHaveBeenCalled();
            expect(t.isScheduled()).toBe(true);
        }

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(t.isScheduled()).toBe(false);

        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(t.isScheduled()).toBe(false);
    });
});
