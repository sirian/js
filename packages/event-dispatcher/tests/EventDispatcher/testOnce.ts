import {BaseEvent, EventDispatcher} from "../../src";

describe("EventDispatcher.once", () => {
    const dispatcher = new EventDispatcher<BaseEvent>();

    test("EventDispatcher.once", () => {
        const foo1 = jest.fn((e) => {
            e.stopPropagation();
        });
        const foo2 = jest.fn(() => dispatcher.emit(new BaseEvent()));
        const foo3 = jest.fn(() => dispatcher.emit(new BaseEvent()));

        dispatcher.once(foo1);
        dispatcher.once(foo2);
        dispatcher.once(foo3);

        dispatcher.emit(new BaseEvent());
        expect(foo1).toHaveBeenCalledTimes(1);
        expect(foo2).toHaveBeenCalledTimes(0);
        expect(foo3).toHaveBeenCalledTimes(0);

        jest.resetAllMocks();
        dispatcher.emit(new BaseEvent());
        expect(foo1).toHaveBeenCalledTimes(0);
        expect(foo2).toHaveBeenCalledTimes(1);
        expect(foo3).toHaveBeenCalledTimes(1);
    });
});
