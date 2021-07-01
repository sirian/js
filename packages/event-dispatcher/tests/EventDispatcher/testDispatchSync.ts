import {BaseEvent, EventDispatcher} from "../../src";

test("testEmit", () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const dispatcher = new EventDispatcher<BaseEvent>();
    dispatcher.addListener(fn1);
    dispatcher.addListener((e) => e.stopPropagation());
    dispatcher.addListener(fn2);

    const event = new BaseEvent();

    dispatcher.emit(event);
    expect(fn1).toHaveBeenCalledWith(event);
    expect(fn2).not.toHaveBeenCalled();
});
