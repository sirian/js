import {Event, EventsDispatcher} from "../../src";
import {TestEventListener} from "../TestEventListener";

test("testInitialState", () => {
    const dispatcher = new EventsDispatcher();

    expect(dispatcher.hasListeners("pre.foo")).toBe(false);
    expect(dispatcher.hasListeners("post.foo")).toBe(false);
});

test("testDispatch", async () => {
    const dispatcher = new EventsDispatcher();
    const testListener = new TestEventListener();
    dispatcher.addListener("pre.foo", (e) => testListener.preFoo(e));
    dispatcher.addListener("post.foo", (e) => testListener.postFoo(e));

    await dispatcher.dispatch("pre.foo", new Event());

    expect(testListener.preFooInvoked).toBe(true);
    expect(testListener.postFooInvoked).toBe(false);
});

test("testDispatch", async () => {
    const dispatcher = new EventsDispatcher();
    const testListener = new TestEventListener();
    dispatcher.addListener("pre.foo", (e) => testListener.preFoo(e));
    dispatcher.addListener("post.foo", (e) => testListener.postFoo(e));

    await dispatcher.dispatch("noevent", new Event());

    expect(testListener.preFooInvoked).toBe(false);
    expect(testListener.postFooInvoked).toBe(false);
});
