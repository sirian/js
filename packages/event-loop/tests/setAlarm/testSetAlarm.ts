import {clearAlarm, setAlarm} from "../../src/setAlarm";

let dateNowSpy;
let now = 0;

const sleep = (ms: number) => now += ms;

const moveTime = (ms: number) => {
    sleep(ms);
    jest.advanceTimersByTime(ms);
};

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
});

afterEach(() => {
    dateNowSpy.mockRestore();
});

describe("setAlarm", () => {
    test("setAlarm(900ms)", () => {
        const fn = jest.fn();
        setAlarm(900, fn);

        moveTime(800);
        expect(fn).toHaveBeenCalledTimes(0);

        moveTime(100);

        expect(fn).toHaveBeenCalledTimes(1);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test("setAlarm(1000ms)", () => {
        const fn = jest.fn();
        setAlarm(1000, fn);

        moveTime(900);
        expect(fn).toHaveBeenCalledTimes(0);

        moveTime(100);

        expect(fn).toHaveBeenCalledTimes(1);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test("setAlarm(1900ms)", () => {
        const fn = jest.fn();
        setAlarm(1900, fn);

        moveTime(1000);
        expect(fn).toHaveBeenCalledTimes(0);

        moveTime(800);
        expect(fn).toHaveBeenCalledTimes(0);

        moveTime(100);

        expect(fn).toHaveBeenCalledTimes(1);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);

        moveTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test("setAlarm(60000ms)", () => {
        const fn = jest.fn();
        setAlarm(60000, fn);

        sleep(59000);
        expect(fn).toHaveBeenCalledTimes(0);
        moveTime(900);
        expect(fn).toHaveBeenCalledTimes(0);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);

        moveTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test("setAlarm/clearAlarm", () => {
        const fn = jest.fn();
        const fn2 = jest.fn(() => clearAlarm(id));
        setAlarm(500, fn2);
        const id = setAlarm(500, fn);

        moveTime(500);
        expect(fn).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(1);

        moveTime(100);

        expect(fn).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    test("setAlarm/clearAlarm", () => {
        const fn = jest.fn();
        const fn2 = jest.fn(() => clearAlarm(id));
        setAlarm(501, fn2);
        const id = setAlarm(500, fn);

        moveTime(500);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(0);

        moveTime(100);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });
});
