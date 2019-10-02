import {Timeout} from "../../src";

describe("Timeout.active", () => {
    test("", async () => {
        jest.useFakeTimers();

        const fn = jest.fn();
        const t = Timeout.create(11, fn);

        expect(fn).not.toHaveBeenCalled();
        expect(t.isActive()).toBe(false);

        t.start();

        for (let i = 0; i < 10; i++) {
            jest.advanceTimersByTime(1);
            expect(fn).not.toHaveBeenCalled();
            expect(t.isActive()).toBe(true);
        }

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalled();
        expect(t.isActive()).toBe(false);
    });
});
