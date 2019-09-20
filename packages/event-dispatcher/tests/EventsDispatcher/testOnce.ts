import {EventsDispatcher} from "../../src";

describe("EventsDispatcher.once", () => {
    test("EventsDispatcher.once", () => {
        const dispatcher = new EventsDispatcher();

        const foo1 = jest.fn(() => dispatcher.dispatch("foo"));
        const foo2 = jest.fn(() => dispatcher.dispatch("bar"));
        const bar = jest.fn(() => dispatcher.dispatch("foo"));

        dispatcher.once("foo", foo1);
        dispatcher.once("foo", foo2);
        dispatcher.once("bar", bar);

        dispatcher.dispatch("foo");

        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(bar).toHaveBeenCalledTimes(1);
    });
});
