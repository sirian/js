import {BaseEvent, EventsDispatcher} from "../../src";

describe("EventsDispatcher.once", () => {
    test("EventsDispatcher.once", () => {
        const dispatcher = new EventsDispatcher();

        const foo1 = jest.fn((e) => dispatcher.dispatch("foo", e));
        const foo2 = jest.fn((e) => dispatcher.dispatch("bar", e));
        const bar = jest.fn((e) => dispatcher.dispatch("foo", e));

        dispatcher.once("foo", foo1);
        dispatcher.once("foo", foo2);
        dispatcher.once("bar", bar);

        dispatcher.dispatch("foo", new BaseEvent());

        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(bar).toHaveBeenCalledTimes(1);
    });
});
