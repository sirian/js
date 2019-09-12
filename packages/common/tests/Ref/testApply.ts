import {Ref} from "../../src";

describe("Ref.apply", () => {
    function mock(this: any, ...args: any) {
        const fn = jest.fn();
        Ref.apply(fn, this, [this, args]);
        return fn;
    }

    test("Ref.apply(mock)", () => {
        const foo = Ref.apply(mock);
        expect(foo).toHaveBeenCalledWith(undefined, []);
    });

    for (const thisArg of [null, undefined, {x: 1}]) {
        test(`Ref.apply(mock, ${thisArg})`, () => {
            const foo = Ref.apply(mock, thisArg);
            expect(foo).toHaveBeenCalledWith(thisArg, []);
        });

        for (const args of [[], [undefined], [1, 2]]) {
            test(`Ref.apply(mock, ${thisArg}, [${args}])`, () => {
                const foo = Ref.apply(mock, thisArg, args);
                expect(foo).toHaveBeenCalledWith(thisArg, args);
            });
        }
    }
});
