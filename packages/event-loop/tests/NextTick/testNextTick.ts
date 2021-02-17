import {nextTick, sleep} from "../../src";

describe("nextTick", () => {
    test("nextTick", async () => {
        const ids: number[] = [];

        const nextTickPromise = (fn: any) => {
            Promise.resolve().then(fn);
        };

        nextTick(() => {
            ids.push(1);
            nextTick(() => ids.push(11));
        });

        nextTickPromise(() => {
            ids.push(2);
            nextTickPromise(() => ids.push(21));
            nextTick(() => ids.push(31));
        });

        nextTick(() => ids.push(3));
        nextTick(() => ids.push(4));

        nextTickPromise(() => ids.push(7));

        nextTick(() => ids.push(8));

        await sleep(0);

        expect(ids).toStrictEqual([1, 2, 3, 4, 7, 8, 11, 21, 31]);
    });
});
