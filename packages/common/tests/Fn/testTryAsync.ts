import {throwError, tryAsync} from "../../src";

describe("Fn.try", () => {
    const err1 = new Error("err1");
    const err2 = new Error("err2");
    const onErrResult = 2;
    const fnResult = 1;
    const onErr = jest.fn(() => onErrResult);
    const fn = jest.fn(() => fnResult);
    const fnThrow1 = jest.fn(() => throwError(err1));
    const fnThrow2 = jest.fn(() => throwError(err2));

    test(`Fn.tryAsync(${fn}) === ${fnResult}`, async () => {
        jest.clearAllMocks();
        expect(await tryAsync(fn)).toBe(fnResult);
        expect(fn).toHaveBeenCalled();
    });

    test(`Fn.tryAsync(${fn}, ${onErr}) === ${fnResult}`, async () => {
        jest.clearAllMocks();
        expect(await tryAsync(fn, onErr)).toBe(1);
        expect(fn).toHaveBeenCalled();
        expect(onErr).not.toHaveBeenCalled();
    });

    test(`Fn.tryAsync(${fnThrow1}, ${onErr}) === ${onErrResult}`, async () => {
        jest.clearAllMocks();
        expect(await tryAsync(fnThrow1, onErr)).toBe(onErrResult);
        expect(fnThrow1).toHaveBeenCalled();
        expect(onErr).toHaveBeenCalledWith(err1);
    });

    test(`Fn.tryAsync(${fnThrow1}, ${onErrResult}) === ${onErrResult}`, async () => {
        jest.clearAllMocks();
        expect(await tryAsync(fnThrow1, onErrResult)).toBe(onErrResult);
        expect(fnThrow1).toHaveBeenCalled();
    });

    test(`Fn.tryAsync(${fnThrow1}) === undefined`, async () => {
        jest.clearAllMocks();
        expect(await tryAsync(fnThrow1)).toBe(undefined);
        expect(fnThrow1).toHaveBeenCalled();
    });

    test(`Fn.tryAsync(${fnThrow1}, ${fnThrow2}) throws ${err2}`, async () => {
        jest.clearAllMocks();
        await expect(tryAsync(fnThrow1, fnThrow2)).rejects.toThrow(err2);
        expect(fnThrow1).toHaveBeenCalled();
        expect(fnThrow2).toHaveBeenCalledWith(err1);
    });
});
