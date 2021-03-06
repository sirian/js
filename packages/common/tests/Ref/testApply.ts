import {apply} from "../../src";

describe("apply", () => {
    function mock(this: any, ...args: any) {
        const fn = jest.fn();
        apply(fn, this, [123, this, args]);
        return fn;
    }

    test("apply(mock)", () => {
        const foo = apply(mock);
        expect(foo).toHaveBeenCalledWith(123, undefined, []);
    });

    for (const thisArg of [null, undefined, {x: 1}]) {
        test(`apply(mock, ${thisArg})`, () => {
            const foo = apply(mock, thisArg);
            expect(foo).toHaveBeenCalledWith(123, thisArg, []);
        });

        for (const args of [[], [undefined], [1, 2]]) {
            test(`apply(mock, ${thisArg}, [${args}])`, () => {
                const foo = apply(mock, thisArg, args);
                expect(foo).toHaveBeenCalledWith(123, thisArg, args);
            });
        }
    }
});
