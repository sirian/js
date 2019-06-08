import {ArgLast, AssertExact} from "../../src";

type Test = [
    AssertExact<never, ArgLast<() => boolean>>,

    AssertExact<string, ArgLast<(x: string) => true>>,

    AssertExact<boolean, ArgLast<(x: string, y: boolean) => true>>,

    AssertExact<boolean | undefined, ArgLast<(x: string, y: boolean | undefined) => true>>,

    AssertExact<boolean | undefined, ArgLast<(x: string, y?: boolean) => true>>,

    AssertExact<symbol, ArgLast<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<Date, ArgLast<(x: string, y: boolean, z: Date) => true>>
];