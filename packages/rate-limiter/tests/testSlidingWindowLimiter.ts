import {MemoryStorage, SlidingWindow, SlidingWindowLimiter} from "../src";

let dateNowSpy;
let now = 0;
beforeAll(() => {
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
});

afterAll(() => {
    dateNowSpy.mockRestore();
});

describe("SlidingWindowLimiter", () => {
    test("", () => {
        const storage = new MemoryStorage<SlidingWindow>();
        const limiter = new SlidingWindowLimiter("test", 10, {seconds: 12}, storage);
        limiter.consume(8);
        now += 15 * 1000;

        let rateLimit = limiter.consume();
        expect(rateLimit.accepted).toBe(true);
        expect(rateLimit.limit).toBe(10);

        rateLimit = limiter.consume(5);
        expect(rateLimit.accepted).toBe(false);
        expect(rateLimit.availableTokens).toBe(3);

        now += 13 * 1000;
        rateLimit = limiter.consume(10);
        expect(rateLimit.accepted).toBe(true);
        expect(rateLimit.limit).toBe(10);
    });
});
