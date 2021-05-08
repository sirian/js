import {Arg1, AssertExact} from "../../src";

type Test = [
    AssertExact<undefined, Arg1<() => boolean>>,

    AssertExact<string | undefined, Arg1<((...args: string[]) => true)>>,
    AssertExact<string, Arg1<((a: string, ...args: string[]) => true)>>,

    AssertExact<string, Arg1<(x: string, y: boolean) => true>>,

    AssertExact<string, Arg1<(x: string, y: boolean | undefined) => true>>,

    AssertExact<string, Arg1<(x: string, y?: boolean) => true>>,

    AssertExact<string, Arg1<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<string, Arg1<(x: string, y: boolean, z: Date) => true>>
];

export default Test;
