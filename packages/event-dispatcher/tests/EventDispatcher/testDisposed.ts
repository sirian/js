import {Disposer} from "@sirian/disposer";
import {EventDispatcher} from "../../src";

describe("EventDispatcher.once", () => {
    const dispatcher = new EventDispatcher();

    test("EventDispatcher.once", () => {
        const fn = jest.fn();
        dispatcher.once(fn);

        expect(dispatcher.hasListener(fn)).toBe(true);

        Disposer.dispose(fn);
        expect(dispatcher.hasListener(fn)).toBe(false);
    });
});
