import {AssertExact, DropLeft} from "../../src";

type Test = [
    AssertExact<[], DropLeft<0, []>>,

    AssertExact<[], DropLeft<1, []>>,
    AssertExact<[], DropLeft<1, [number]>>,
    AssertExact<[string], DropLeft<1, [number, string]>>,
    AssertExact<string[], DropLeft<1, [number, ...string[]]>>,
    AssertExact<string[], DropLeft<2, [number, ...string[]]>>,
    AssertExact<[number, ...string[]], DropLeft<0, [number, ...string[]]>>,

    AssertExact<[], DropLeft<2, []>>,
    AssertExact<[], DropLeft<2, [number]>>,
    AssertExact<[], DropLeft<2, [number, string]>>,
    AssertExact<string[], DropLeft<2, [number, ...string[]]>>,
    AssertExact<[boolean], DropLeft<2, [number, string, boolean]>>,
    AssertExact<[boolean, ...string[]], DropLeft<2, [number, string, boolean, ...string[]]>>
];
