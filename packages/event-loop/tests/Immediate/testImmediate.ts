import {Immediate} from "../../src";

describe("Immediate", () => {
    test("Immediate", () => {
        jest.useFakeTimers();
        const ids: number[] = [];

        Immediate.start(() => {
            ids.push(1);
            Immediate.start(() => ids.push(11));
        });

        setImmediate(() => {
            ids.push(2);
            setImmediate(() => ids.push(21));
            Immediate.start(() => ids.push(31));
        });

        Immediate.start(() => ids.push(3));
        Immediate.start(() => ids.push(4));
        setImmediate(() => ids.push(7));
        Immediate.start(() => ids.push(8));

        jest.runAllImmediates();

        expect(ids).toStrictEqual([1, 3, 4, 8, 2, 7, 11, 31, 21]);
    });

    test("", () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        Immediate.start(fn).clear();
        jest.runAllImmediates();
        expect(fn).not.toHaveBeenCalled();
    });

    test("", () => {
        jest.useFakeTimers();
        const ids: any[] = [];

        let immCounter = 0;
        let fooCounter = 0;
        const imm = Immediate.start(() => {
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
