import {AssertExact, DropLeft} from "../../src";

type Test = [
    AssertExact<[], DropLeft<0, []>>,
    AssertExact<readonly [], DropLeft<0, readonly []>>,

    AssertExact<[], DropLeft<1, []>>,
    AssertExact<readonly [], DropLeft<1, readonly []>>,

    AssertExact<[], DropLeft<1, [number]>>,
    AssertExact<readonly [], DropLeft<1, readonly [number]>>,

    AssertExact<[string], DropLeft<1, [number, string]>>,
    AssertExact<readonly [string], DropLeft<1, readonly [number, string]>>,

    AssertExact<string[], DropLeft<1, [number, ...string[]]>>,
    AssertExact<readonly string[], DropLeft<1, readonly [number, ...string[]]>>,

    AssertExact<string[], DropLeft<2, [number, ...string[]]>>,
    AssertExact<readonly string[], DropLeft<2, readonly [number, ...string[]]>>,

    AssertExact<[number, ...string[]], DropLeft<0, [number, ...string[]]>>,
    AssertExact<readonly [number, ...string[]], DropLeft<0, readonly [number, ...string[]]>>,

    AssertExact<string[], DropLeft<1, [number, ...string[]]>>,
    AssertExact<readonly string[], DropLeft<1, readonly [number, ...string[]]>>,

    AssertExact<string[], DropLeft<2, [number, ...string[]]>>,
    AssertExact<readonly string[], DropLeft<2, readonly [number, ...string[]]>>,

    AssertExact<[], DropLeft<2, []>>,
    AssertExact<readonly [], DropLeft<2, readonly []>>,

    AssertExact<[], DropLeft<2, [number]>>,
    AssertExact<readonly [], DropLeft<2, readonly [number]>>,

    AssertExact<[], DropLeft<2, [number, string]>>,
    AssertExact<readonly [], DropLeft<2, readonly [number, string]>>,

    AssertExact<string[], DropLeft<2, [number, ...string[]]>>,
    AssertExact<readonly string[], DropLeft<2, readonly [number, ...string[]]>>,

    AssertExact<[boolean], DropLeft<2, [number, string, boolean]>>,
    AssertExact<readonly [boolean], DropLeft<2, readonly [number, string, boolean]>>,

    AssertExact<[boolean, ...string[]], DropLeft<2, [number, string, boolean, ...string[]]>>,
    AssertExact<readonly [boolean, ...string[]], DropLeft<2, readonly [number, string, boolean, ...string[]]>>,

];
