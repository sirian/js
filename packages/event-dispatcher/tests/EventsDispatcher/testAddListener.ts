import {EventsDispatcher} from "../../src";
import {TestEventListener} from "../TestEventListener";

test("testAddListener", () => {
    const dispatcher = new EventsDispatcher();
    const testListener = new TestEventListener();
    dispatcher.addListener("pre.foo", (e) => testListener.preFoo(e));
    dispatcher.addListener("post.foo", (e) => testListener.postFoo(e));

    expect(dispatcher.hasListeners("pre.foo")).toBe(true);
    expect(dispatcher.hasListeners("post.foo")).toBe(true);
    expect(dispatcher.getListeners("pre.foo")).toHaveLength(1);
    expect(dispatcher.getListeners("post.foo")).toHaveLength(1);
});
