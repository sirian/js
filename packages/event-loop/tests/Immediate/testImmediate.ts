import {Immediate, startImmediate} from "../../src";

describe("Immediate", () => {
    test("Immediate", () => {
        jest.useFakeTimers();
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

        jest.runAllImmediates();

        expect(ids).toStrictEqual([1, 3, 4, 8, 2, 7, 11, 31, 21]);
    });

    test("", () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        startImmediate(fn).clear();
        jest.runAllImmediates();
        expect(fn).not.toHaveBeenCalled();
    });

    test("", () => {
        jest.useFakeTimers();
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
        jest.runAllImmediates();
        expect(ids).toStrictEqual([1, "bar1", 2, "foo1", "bar2", 3, "foo2", "foo3"]);
    });
});
