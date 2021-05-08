import {ArgCount, AssertExact, Ctor, Func} from "../../src";

declare class SubFunction extends Function {
    constructor(x?: number);
}

type Test = [
    AssertExact<number, ArgCount<Func>>,

    AssertExact<never, ArgCount<{}>>,

    AssertExact<1 | 2, ArgCount<Func<any, [string, number?]>>>,

    AssertExact<number, ArgCount<Ctor>>,

    AssertExact<0 | 1, ArgCount<Ctor<any, [boolean?]>>>,

    AssertExact<number, ArgCount<FunctionConstructor>>,

    AssertExact<number, ArgCount<Function>>,

    AssertExact<0 | 1, ArgCount<typeof SubFunction>>,

    AssertExact<number, ArgCount<SubFunction>>,

    AssertExact<number, ArgCount<(...args: any[]) => true>>,

    AssertExact<0, ArgCount<() => true>>,

    AssertExact<1, ArgCount<(x: number) => true>>,

    AssertExact<number, ArgCount<(x: number, ...args: any[]) => true>>,

    AssertExact<2, ArgCount<(x: number, y: string) => true>>,

    AssertExact<1 | 2, ArgCount<(x: number, y?: string) => true>>,

    AssertExact<number, ArgCount<(x: number, y?: string, ...args: any[]) => true>>
];

export default Test;
