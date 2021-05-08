import {AssertExact, GuardedType} from "../../src";

type Test = [
    AssertExact<true, GuardedType<(value: any) => value is true>>,
    AssertExact<true, GuardedType<(x: any, y: any) => x is true>>,
    AssertExact<never, GuardedType<(value: any) => boolean>>
];
