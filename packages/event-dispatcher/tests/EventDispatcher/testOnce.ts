import {Event, EventDispatcher} from "../../src";

describe("EventDispatcher.once", () => {
    const dispatcher = new EventDispatcher<Event>();

    test("EventDispatcher.once", () => {
        const foo1 = jest.fn((e) => {
            e.stopPropagation();
        });
        const foo2 = jest.fn(() => dispatcher.dispatchSync(new Event()));
        const foo3 = jest.fn(() => dispatcher.dispatchSync(new Event()));

        dispatcher.once(foo1);
        dispatcher.once(foo2);
        dispatcher.once(foo3);

        dispatcher.dispatchSync(new Event());
        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(foo3).toHaveBeenCalledTimes(0);

        jest.resetAllMocks();
        dispatcher.dispatchSync(new Event());
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(foo3).toHaveBeenCalledTimes(1);
    });
});
