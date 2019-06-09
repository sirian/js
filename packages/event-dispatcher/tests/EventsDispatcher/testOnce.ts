import {Event, EventsDispatcher} from "../../src";

describe("EventDispatcher.once", () => {
    const dispatcher = new EventsDispatcher();

    test("EventDispatcher.once", () => {
        const fn = jest.fn();
        dispatcher.once("foo", fn);

        expect(fn).toHaveBeenCalledTimes(0);
        expect(dispatcher.hasListeners("foo")).toBe(true);

        dispatcher.dispatchSync("foo", new Event());
        expect(fn).toHaveBeenCalledTimes(1);
        expect(dispatcher.hasListeners("foo")).toBe(false);

        dispatcher.dispatchSync("foo", new Event());
        expect(fn).toHaveBeenCalledTimes(1);
        expect(dispatcher.hasListeners("foo")).toBe(false);
    });
});
