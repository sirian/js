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
        const ids: number[] = [];
        const imm = Immediate.start(() => {
            imm.start();
            ids.push(1);
            setImmediate(() => {
                ids.push(2);
                imm.clear();
            });
        });
        setImmediate(() => {
            ids.push(3);
        });
        jest.runAllImmediates();
        expect(ids).toStrictEqual([1, 3, 1, 2, 2]);
    });
});
