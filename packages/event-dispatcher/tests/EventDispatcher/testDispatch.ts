import {XPromise} from "@sirian/xpromise";
import {BaseEvent, EventDispatcher} from "../../src";

test("Test async dispatch", async () => {
    const dispatcher = new EventDispatcher();

    const data: any[] = [];

    dispatcher.addListener(() => data.push(1));
    dispatcher.addListener(() => XPromise.resolve().then(() => data.push(2)), {
        passive: true,
    });
    dispatcher.addListener(() => data.push(3));
    dispatcher.addListener(async () => data.push(4));
    dispatcher.addListener(async () => data.push(5));
    dispatcher.addListener(() => Promise.resolve().then(() => data.push(6)));
    dispatcher.addListener(() => Promise.resolve().then(() => data.push(7)));

    const event = new BaseEvent();
    const promise = dispatcher.dispatch(event);

    expect(data).toStrictEqual([1, 2, 3, 4]);

    await promise;

    expect(data).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
});
