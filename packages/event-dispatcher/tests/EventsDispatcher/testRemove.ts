import {EventsDispatcher} from "../../src";

test("Test remove last listener", () => {
    const dispatcher = new EventsDispatcher();
    const listener1 = () => 1;
    const listener2 = () => 2;
    dispatcher.addListener("test", listener1);
    dispatcher.addListener("test", listener2);
    expect(dispatcher.hasListeners("test")).toBe(true);
    expect(dispatcher.getListeners("test")).toHaveLength(2);

    dispatcher.removeListener("test", listener1);

    expect(dispatcher.hasListeners("test")).toBe(true);
    expect(dispatcher.getListeners("test")).toHaveLength(1);

    dispatcher.removeListener("test", listener2);

    expect(dispatcher.hasListeners("test")).toBe(false);
    expect(dispatcher.getListeners("test")).toHaveLength(0);
});
