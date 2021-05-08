import {Arg, AssertExact} from "../../src";

type Test = [
    AssertExact<never, Arg<number, () => boolean>>,
    AssertExact<undefined, Arg<0, () => boolean>>,

    AssertExact<string, Arg<number, (x: string) => true>>,

    AssertExact<string, Arg<0, (x: string) => true>>,
    AssertExact<undefined, Arg<1, (x: string) => true>>,

    AssertExact<string | boolean, Arg<number, (x: string, y: boolean) => true>>,

    AssertExact<string | boolean | undefined, Arg<number, (x: string, y: boolean | undefined) => true>>,

    AssertExact<string | boolean | undefined, Arg<number, (x: string, y?: boolean) => true>>,

    AssertExact<string | boolean | symbol, Arg<number, (x: string, y: boolean, ...args: symbol[]) => true>>,

    AssertExact<string | boolean | Date, Arg<number, (x: string, y: boolean, z: Date) => true>>
];
