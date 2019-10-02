import {EventLoop} from "../../src";
import {NextTick} from "../../src/NextTick";

describe("NextTick.start", () => {
    test("NextTick.start", async () => {
        const ids: number[] = [];

        const nextTick = (fn: any) => {
            Promise.resolve().then(fn);
        };

        NextTick.start(() => {
            ids.push(1);
            NextTick.start(() => ids.push(11));
        });

        nextTick(() => {
            ids.push(2);
            nextTick(() => ids.push(21));
            NextTick.start(() => ids.push(31));
        });

        NextTick.start(() => ids.push(3));
        NextTick.start(() => ids.push(4));

        nextTick(() => ids.push(7));

        NextTick.start(() => ids.push(8));

        await EventLoop.waitTimeout(0);

        expect(ids).toStrictEqual([1, 3, 4, 8, 2, 7, 11, 31, 21]);
    });
});
