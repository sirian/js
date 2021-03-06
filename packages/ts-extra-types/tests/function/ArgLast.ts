import {ArgLast, AssertExact} from "../../src";

declare type Test = [
    AssertExact<undefined, ArgLast<() => string>>,

    AssertExact<string, ArgLast<(x: string) => true>>,

    AssertExact<boolean, ArgLast<(x: string, y: boolean) => true>>,

    AssertExact<boolean | undefined, ArgLast<(x: string, y: boolean | undefined) => true>>,

    AssertExact<string | boolean | undefined, ArgLast<(x: string, y?: boolean) => true>>,

    AssertExact<symbol | boolean, ArgLast<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<Date, ArgLast<(x: string, y: boolean, z: Date) => true>>
];
