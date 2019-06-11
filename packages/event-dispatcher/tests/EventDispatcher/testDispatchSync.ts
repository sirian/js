import {Event, EventDispatcher} from "../../src";

test("testDispatchSync", async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const dispatcher = new EventDispatcher<Event>();
    dispatcher.addListener(fn1);
    dispatcher.addListener((e) => e.stopPropagation());
    dispatcher.addListener(fn2);

    const event = new Event();

    dispatcher.dispatchSync(event);
    expect(fn1).toHaveBeenCalledWith(event);
    expect(fn2).not.toHaveBeenCalled();
});
