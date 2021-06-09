import {Args, AssertExact} from "../../src";

declare type Test = [
    AssertExact<[], Args<() => boolean>>,

    AssertExact<[string], Args<(x: string) => true>>,

    AssertExact<[string, boolean], Args<(x: string, y: boolean) => true>>,

    AssertExact<[string, boolean | undefined], Args<(x: string, y: boolean | undefined) => true>>,

    AssertExact<[string, (boolean | undefined)?], Args<(x: string, y?: boolean) => true>>,

    AssertExact<[string, boolean, ...symbol[]], Args<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<[string, boolean, Date], Args<(x: string, y: boolean, z: Date) => true>>
];
