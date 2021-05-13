import {call} from "@sirian/common";

describe("call", () => {
    function mock(this: any, ...args: any) {
        const fn = jest.fn();
        call(fn, this, 123, this, args);
        return fn;
    }

    test("call(mock)", () => {
        const foo = call(mock);
        expect(foo).toHaveBeenCalledWith(123, undefined, []);
    });

    for (const thisArg of [null, undefined, {x: 1}]) {
        test(`call(mock, ${thisArg})`, () => {
            const foo = call(mock, thisArg);
            expect(foo).toHaveBeenCalledWith(123, thisArg, []);
        });

        for (const args of [[], [undefined], [1, 2]]) {
            test(`call(mock, ${thisArg}, [${args}])`, () => {
                const foo = call(mock, thisArg, ...args);
                expect(foo).toHaveBeenCalledWith(123, thisArg, args);
            });
        }
    }
});
