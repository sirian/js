import {Args} from "@sirian/ts-extra-types";
import {Dispatcher, ListenerCallback, ListenerOptions} from "../../src";

describe("Dispatcher", () => {
    const target = new Dispatcher();

    const l1 = () => 1;
    const l2 = () => 2;
    const l3 = () => 3;

    const data: Array<["addListener" | "removeListener", [ListenerCallback<any>, ListenerOptions?], Array<ListenerCallback<any>>]> = [
        ["addListener", [l1], [l1]],
        ["addListener", [l1], [l1]],
        ["addListener", [l2], [l1, l2]],
        ["addListener", [l2, {priority: 10}], [l2, l1]],
        ["addListener", [l3, {priority: 5}], [l2, l3, l1]],
        ["addListener", [l1, {priority: 7}], [l2, l1, l3]],
        ["removeListener", [l1], [l2, l3]],
        ["addListener", [l1, {priority: 100}], [l1, l2, l3]],
        ["removeListener", [l3], [l1, l2]],
        ["removeListener", [l2], [l1]],
        ["removeListener", [l1], []],
    ];

    test.each(data)("%s => %O", <K extends "addListener" | "removeListener">(method: K, args: Args<Dispatcher[K]>, expected: Array<ListenerCallback<any>>) => {
        const [callback, opts] = args;

        target[method](callback, opts);

        expect(target.size).toBe(expected.length);

        if (expected.includes(callback)) {
            expect((target as any)._map.get(callback)).toStrictEqual({
                once: false,
                priority: 0,
                ...opts,
            });
        }

        const listeners = target.all();

        expect(listeners).toStrictEqual(expected);

        for (const fn of [l1, l2, l3]) {
            expect(target.hasListener(fn)).toBe(expected.includes(fn));
        }
    });
});
