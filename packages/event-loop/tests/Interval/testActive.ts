import {Interval} from "../../src";

describe("Interval.active", () => {
    test("", () => {
        jest.useFakeTimers();
        const fn = jest.fn();

        const t = Interval.create(5, fn);

        expect(t.isScheduled()).toBe(false);

        t.start();

        expect(t.isScheduled()).toBe(true);
        for (let i = 1; i < 20; i++) {
            jest.advanceTimersByTime(1);
            expect(t.isScheduled()).toBe(true);
            expect(fn).toHaveBeenCalledTimes(Math.floor(i / 5));
        }

        t.clear();

        fn.mockReset();

        expect(t.isScheduled()).toBe(false);

        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(0);
    });
});
