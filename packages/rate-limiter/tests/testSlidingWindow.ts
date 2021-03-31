import {SlidingWindow} from "../src";

let dateNowSpy;
let now = 0;
beforeAll(() => {
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
});

afterAll(() => {
    dateNowSpy.mockRestore();
});

describe("SlidingWindow", () => {
    test("", () => {
        const window = new SlidingWindow("foo", 10);
        expect(window.getExpirationMs()).toBe(2 * 10);
        expect(window.getExpirationMs()).toBe(2 * 10);

        const data = window.serialize();
        const cachedWindow = SlidingWindow.unserialize(data);
        expect(cachedWindow.getExpirationMs()).toBe(undefined);

        const w2 = SlidingWindow.createFromPreviousWindow(cachedWindow, 15);
        expect(w2.getExpirationMs()).toBe(2 * 15);
    });

    test("", () => {
        const window = new SlidingWindow("foo", 60);
        expect(window.getHitCount()).toBe(0);

        window.add(20);
        expect(window.getHitCount()).toBe(20);

        now += 60;
        const w2 = SlidingWindow.createFromPreviousWindow(window, 60);
        expect(w2.getHitCount()).toBe(20);

        now += 30;
        expect(w2.getHitCount()).toBe(10);

        now += 30;
        expect(w2.getHitCount()).toBe(0);

        now += 30;
        expect(w2.getHitCount()).toBe(0);
    });

    test("", () => {
        const window = new SlidingWindow("foo", 60);

        now += 300;
        const w2 = SlidingWindow.createFromPreviousWindow(window, 60);
        expect(w2.isExpired()).toBe(true);
    });
});
