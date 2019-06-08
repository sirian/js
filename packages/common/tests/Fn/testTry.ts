import {Fn} from "../../src";

describe("Fn.try", () => {
    const err1 = new Error("err1");
    const err2 = new Error("err2");
    const onErrResult = 2;
    const fnResult = 1;
    const onErr = jest.fn(() => onErrResult);
    const fn = jest.fn(() => fnResult);
    const fnThrow1 = jest.fn(() => Fn.throw(err1));
    const fnThrow2 = jest.fn(() => Fn.throw(err2));

    test(`Fn.try(${fn}) === ${fnResult}`, () => {
        jest.clearAllMocks();
        expect(Fn.try(fn)).toBe(fnResult);
        expect(fn).toHaveBeenCalled();
    });

    test(`Fn.try(${fn}, ${onErr}) === ${fnResult}`, () => {
        jest.clearAllMocks();
        expect(Fn.try(fn, onErr)).toBe(1);
        expect(fn).toHaveBeenCalled();
        expect(onErr).not.toHaveBeenCalled();
    });

    test(`Fn.try(${fnThrow1}, ${onErr}) === ${onErrResult}`, () => {
        jest.clearAllMocks();
        expect(Fn.try(fnThrow1, onErr)).toBe(onErrResult);
        expect(fnThrow1).toHaveBeenCalled();
        expect(onErr).toHaveBeenCalledWith(err1);
    });

    test(`Fn.try(${fnThrow1}) === undefined`, () => {
        jest.clearAllMocks();
        expect(Fn.try(fnThrow1)).toBe(undefined);
        expect(fnThrow1).toHaveBeenCalled();
    });

    test(`Fn.try(${fnThrow1}, ${fnThrow2}) throws ${err2}`, () => {
        jest.clearAllMocks();
        expect(() => Fn.try(fnThrow1, fnThrow2)).toThrow(err2);
        expect(fnThrow1).toHaveBeenCalled();
        expect(fnThrow2).toHaveBeenCalledWith(err1);
    });
});