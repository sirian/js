import {Interval} from "../../src";

describe("Interval.active", () => {
    test("", async () => {
        jest.useFakeTimers();
        const fn = jest.fn();

        const t = Interval.create(5, fn);

        expect(t.isActive()).toBe(false);
        expect(Interval.active.size).toBe(0);

        t.start();

        expect(t.isActive()).toBe(true);
        expect(Interval.active.size).toBe(1);
        for (let i = 1; i < 20; i++) {
            jest.advanceTimersByTime(1);
            expect(t.isActive()).toBe(true);
            expect(Interval.active.size).toBe(1);
            expect(fn).toHaveBeenCalledTimes(Math.floor(i / 5));
        }

        t.stop();

        fn.mockReset();

        expect(t.isActive()).toBe(false);
        expect(Interval.active.size).toBe(0);

        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(0);
    });
});
