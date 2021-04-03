import {Alarm} from "../../src";

let dateNowSpy;
let now = 0;

const sleep = (ms: number) => now += ms;

const moveTime = (ms: number) => {
    sleep(ms);
    jest.advanceTimersByTime(ms);
};

beforeEach(() => {
    now = 0;
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
});

afterEach(() => {
    dateNowSpy.mockRestore();
});

describe("Alarm.active", () => {
    test("", async () => {
        const fn = jest.fn();
        const t = Alarm.create(11, fn);

        expect(fn).not.toHaveBeenCalled();
        expect(t.isScheduled()).toBe(false);

        t.start();

        for (let i = 0; i < 10; i++) {
            moveTime(1);
            expect(fn).not.toHaveBeenCalled();
            expect(t.isScheduled()).toBe(true);
        }

        moveTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(t.isScheduled()).toBe(false);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(t.isScheduled()).toBe(false);
    });
});
