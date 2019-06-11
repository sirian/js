import {EventListenerFn, Listenable} from "../../src";

describe("Listenable", () => {
    const dispatcher = new Listenable();

    const l1 = () => 1;
    const l2 = () => 2;
    const l3 = () => 3;

    const data: Array<[() => any, EventListenerFn[]]> = [
        [() => dispatcher.addListener(l1), [l1]],
        [() => dispatcher.addListener(l1), [l1, l1]],
        [() => dispatcher.addListener(l2), [l1, l1, l2]],
        [() => dispatcher.addListener({callback: l2, priority: 10}), [l2, l1, l1, l2]],
        [() => dispatcher.addListener({callback: l3, priority: 5}), [l2, l3, l1, l1, l2]],
        [() => dispatcher.addListener({callback: l1, priority: 7}), [l2, l1, l3, l1, l1, l2]],
        [() => dispatcher.removeListener(l1), [l2, l3, l2]],
        [() => dispatcher.addListener({callback: l1, priority: 100}), [l1, l2, l3, l2]],
        [() => dispatcher.removeListener(l3), [l1, l2, l2]],
        [() => dispatcher.removeListener(l2), [l1]],
        [() => dispatcher.removeListener(l1), []],
    ];

    test.each(data)("%s => %p", (fn, expected) => {
        fn();
        const listeners = dispatcher.getListeners();
        const callbacks = listeners.map(((listener) => listener.callback));

        expect(callbacks).toStrictEqual(expected);
        expect(dispatcher.hasListeners()).toBe(expected.length > 0);

        for (const callback of [l1, l2, l3]) {
            expect(dispatcher.hasListener(callback)).toBe(expected.includes(callback));
        }
    });
});
