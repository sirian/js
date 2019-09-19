import {Args} from "@sirian/ts-extra-types";
import {ListenerCallback, ListenerOptions, ListenerSet} from "../../src";

describe("Listenable", () => {
    const target = new ListenerSet();

    const l1 = () => 1;
    const l2 = () => 2;
    const l3 = () => 3;

    const data: Array<["add" | "delete", [ListenerCallback, ListenerOptions?], ListenerCallback[]]> = [
        ["add", [l1], [l1]],
        ["add", [l1], [l1]],
        ["add", [l2], [l1, l2]],
        ["add", [l2, {priority: 10}], [l2, l1]],
        ["add", [l3, {priority: 5}], [l2, l3, l1]],
        ["add", [l1, {priority: 7, passive: true}], [l2, l1, l3]],
        ["delete", [l1], [l2, l3]],
        ["add", [l1, {priority: 100}], [l1, l2, l3]],
        ["delete", [l3], [l1, l2]],
        ["delete", [l2], [l1]],
        ["delete", [l1], []],
    ];

    test.each(data)("%s => %p", <K extends "add" | "delete">(method: K, args: Args<ListenerSet[K]>, expected: ListenerCallback[]) => {
        const [callback, opts] = args;

        target[method](callback, opts);

        expect(target.size).toBe(expected.length);

        if (expected.includes(callback)) {
            expect(target.get(callback)).toStrictEqual({
                once: false,
                priority: 0,
                passive: false,
                callback,
                ...opts,
            });
        }

        const listeners = target.all().map((obj) => obj.callback);

        expect(listeners).toStrictEqual(expected);

        for (const fn of [l1, l2, l3]) {
            expect(target.has(fn)).toBe(expected.includes(fn));
        }
    });
});
