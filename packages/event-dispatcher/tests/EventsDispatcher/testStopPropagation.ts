import {Event, EventsDispatcher} from "../../src";
import {TestEventListener} from "../TestEventListener";

test("testStopEventPropagation", async () => {
    const dispatcher = new EventsDispatcher();
    const testListener = new TestEventListener();
    const otherListener = new TestEventListener();
    // postFoo() stops the propagation, so only one listener should
    // be executed
    // Manually set priority to enforce this.listener to be called first
    dispatcher.addListener("post.foo", (e) => testListener.postFoo(e));
    dispatcher.addListener("post.foo", (e) => otherListener.postFoo(e));

    await dispatcher.dispatch("post.foo", new Event());
    expect(testListener.postFooInvoked).toBe(true);
    expect(otherListener.postFooInvoked).toBe(false);
});
