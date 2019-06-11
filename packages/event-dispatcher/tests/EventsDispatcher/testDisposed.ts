import {Disposer} from "@sirian/disposer";
import {EventsDispatcher} from "../../src";

describe("EventsDispatcher.once", () => {
    const dispatcher = new EventsDispatcher();

    test("EventsDispatcher.once", () => {
        const fn = jest.fn();
        dispatcher.once("foo", fn);

        expect(dispatcher.hasListeners("foo")).toBe(true);

        Disposer.dispose(fn);
        expect(dispatcher.hasListeners("foo")).toBe(false);
    });
});
