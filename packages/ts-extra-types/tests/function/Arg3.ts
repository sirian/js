import {Arg3, AssertExact} from "../../src";

type Test = [
    AssertExact<undefined, Arg3<() => boolean>>,

    AssertExact<undefined, Arg3<(x: string) => true>>,

    AssertExact<undefined, Arg3<(x: string, y: boolean) => true>>,

    AssertExact<undefined, Arg3<(x: string, y: boolean | undefined) => true>>,

    AssertExact<undefined, Arg3<(x: string, y?: boolean) => true>>,

    AssertExact<symbol | undefined, Arg3<(x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<Date, Arg3<(x: string, y: boolean, z: Date) => true>>
];

export default Test;
