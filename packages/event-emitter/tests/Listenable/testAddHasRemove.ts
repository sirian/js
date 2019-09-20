import {Args} from "@sirian/ts-extra-types";
import {ListenerCallback, ListenerOptions, ListenerSet} from "../../src";

describe("Listenable", () => {
    const target = new ListenerSet();

    const l1 = () => 1;
    const l2 = () => 2;
    const l3 = () => 3;

    const data: Array<["addListener" | "removeListener", [ListenerCallback, ListenerOptions?], ListenerCallback[]]> = [
        ["addListener", [l1], [l1]],
        ["addListener", [l1], [l1]],
        ["addListener", [l2], [l1, l2]],
        ["addListener", [l2, {priority: 10}], [l2, l1]],
        ["addListener", [l3, {priority: 5}], [l2, l3, l1]],
        ["addListener", [l1, {priority: 7, passive: true}], [l2, l1, l3]],
        ["removeListener", [l1], [l2, l3]],
        ["addListener", [l1, {priority: 100}], [l1, l2, l3]],
        ["removeListener", [l3], [l1, l2]],
        ["removeListener", [l2], [l1]],
        ["removeListener", [l1], []],
    ];

    test.each(data)("%s => %p", <K extends "addListener" | "removeListener">(method: K, args: Args<ListenerSet[K]>, expected: ListenerCallback[]) => {
        const [callback, opts] = args;

        target[method](callback, opts);

        expect(target.size).toBe(expected.length);

        if (expected.includes(callback)) {
            expect(target.getListener(callback)).toStrictEqual({
                limit: 0,
                times: 0,
                priority: 0,
                passive: false,
                callback,
                ...opts,
            });
        }

        const listeners = target.all().map((obj) => obj.callback);

        expect(listeners).toStrictEqual(expected);

        for (const fn of [l1, l2, l3]) {
            expect(target.hasListener(fn)).toBe(expected.includes(fn));
        }
    });
});
