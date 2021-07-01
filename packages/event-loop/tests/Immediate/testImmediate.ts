import {MessageChannel} from "worker_threads";
import {setImmediate, sleep, startImmediate} from "../../src";

beforeAll(() => {
    globalThis.MessageChannel = MessageChannel;
});

describe("Immediate", () => {
    test("Immediate", async () => {
        const ids: number[] = [];

        startImmediate(() => {
            ids.push(1);
            startImmediate(() => ids.push(11));
        });

        setImmediate(() => {
            ids.push(2);
            setImmediate(() => ids.push(21));
            startImmediate(() => ids.push(31));
        });

        startImmediate(() => ids.push(3));
        startImmediate(() => ids.push(4));
        setImmediate(() => ids.push(7));
        startImmediate(() => ids.push(8));

        await sleep(20);

        expect(ids).toStrictEqual([1, 3, 4, 8, 2, 7, 11, 31, 21]);
    });

    test("", async () => {
        const fn = jest.fn();
        startImmediate(fn).clear();
        await sleep(10);
        expect(fn).not.toHaveBeenCalled();
    });

    test("", async () => {
        const ids: any[] = [];

        let immCounter = 0;
        let fooCounter = 0;
        const imm = startImmediate(() => {
            ids.push(++immCounter);
            if (immCounter < 3) {
                imm.start();
            }
            setImmediate(() => ids.push("foo" + ++fooCounter));
        });
        setImmediate(() => {
            ids.push("bar1");
            setImmediate(() => ids.push("bar2"));
        });
        await sleep(20);
        expect(ids).toStrictEqual([1, "bar1", 2, "foo1", "bar2", 3, "foo2", "foo3"]);
    });
});
