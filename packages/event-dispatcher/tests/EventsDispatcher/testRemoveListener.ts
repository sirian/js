import {EventsDispatcher} from "../../src";

test("testRemoveListener", () => {
    const dispatcher = new EventsDispatcher();
    const listener = jest.fn();

    dispatcher.addListener("pre.bar", listener);

    expect(dispatcher.hasListeners("pre.bar")).toBe(true);

    dispatcher.removeListener("pre.bar", listener);
    expect(dispatcher.hasListeners("pre.bar")).toBe(false);

    dispatcher.removeListener("notExists", listener);
});
