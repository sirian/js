import {AssertExact, ThisArg} from "../../src";

type Test = [
    AssertExact<unknown, ThisArg<() => any>>,
    AssertExact<unknown, ThisArg<DateConstructor>>,
    AssertExact<unknown, ThisArg<(this: unknown) => any>>,
    AssertExact<never, ThisArg<(this: never) => any>>,
    AssertExact<null, ThisArg<(this: null) => any>>,
    AssertExact<unknown, ThisArg<(this: any) => any>>,
    AssertExact<object, ThisArg<(this: object) => any>>,
    AssertExact<Number | String, ThisArg<(this: Number | String) => any>>,
    AssertExact<Date, ThisArg<(<T extends Date>(this: T) => any)>>,
    AssertExact<unknown, ThisArg<(this: unknown) => any>>
];

export default Test;
