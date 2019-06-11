import {Event, EventDispatcher} from "../../src";

describe("EventDispatcher.once", () => {
    const dispatcher = new EventDispatcher();

    test("EventDispatcher.once", () => {
        const fn = jest.fn();
        dispatcher.once(fn);

        expect(fn).toHaveBeenCalledTimes(0);
        expect(dispatcher.hasListener(fn)).toBe(true);

        dispatcher.dispatchSync(new Event());
        expect(fn).toHaveBeenCalledTimes(1);
        expect(dispatcher.hasListener(fn)).toBe(false);

        dispatcher.dispatchSync(new Event());
        expect(fn).toHaveBeenCalledTimes(1);
        expect(dispatcher.hasListener(fn)).toBe(false);
    });
});
