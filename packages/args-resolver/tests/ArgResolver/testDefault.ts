import {isNumber, isString} from "@sirian/common";
import {ArgResolveError, ArgResolver} from "../../src";

const defaultClause = jest.fn(() => "default");
const numberClause = jest.fn(() => "number");
const numberArg = Date.now();

afterEach(() => {
    defaultClause.mockReset();
    numberClause.mockReset();
});

test("", () => {
    const res = ArgResolver.switch(numberArg)
        .when(isNumber, numberClause)
        .resolve(defaultClause);

    expect(numberClause).toHaveBeenCalledTimes(1);
    expect(numberClause).toHaveBeenCalledWith(numberArg);
    expect(defaultClause).not.toBeCalled();
    expect(res).toBe(numberClause());
});

test("", () => {
    const fn = jest.fn(() => false);

    const res = ArgResolver.switch(numberArg)
        .when(isNumber, numberClause)
        .when(isNumber, fn)
        .resolve(defaultClause);

    expect(numberClause).toHaveBeenCalledTimes(1);
    expect(numberClause).toHaveBeenCalledWith(numberArg);
    expect(defaultClause).not.toBeCalled();
    expect(fn).not.toBeCalled();

    expect(res).toBe(numberClause());
});

test("Test throws error when no default", () => {
    const resolver = ArgResolver.switch(numberArg).when(isString, jest.fn());
    expect(() => resolver.resolve()).toThrow(ArgResolveError);
});
