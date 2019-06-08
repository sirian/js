import {Arg2, AssertExact} from "../../src";

type Test = [
    AssertExact<undefined, Arg2<() => boolean>>,

    AssertExact<undefined, Arg2<(x: string) => true>>,

    AssertExact<boolean, Arg2<(x: string, y: boolean) => true>>,

    AssertExact<boolean | undefined, Arg2<(x: string, y: boolean | undefined) => true>>,

    AssertExact<boolean | undefined, Arg2<(x: string, y?: boolean) => true>>,

    AssertExact<boolean, Arg2<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<boolean, Arg2<(x: string, y: boolean, z: Date) => true>>
];
