import {AssertExact, LastElement} from "../../src";

type Test = [
    AssertExact<undefined, LastElement<[]>>,
    AssertExact<number, LastElement<[number]>>,
    AssertExact<boolean, LastElement<[number, boolean]>>,
    AssertExact<string, LastElement<[number, boolean, string]>>,
    AssertExact<boolean, LastElement<boolean[]>>,
    AssertExact<1, LastElement<[1]>>,
    AssertExact<1 | undefined, LastElement<[1?]>>,
    AssertExact<undefined | 2, LastElement<[1?, 2?]>>,
    AssertExact<3, LastElement<[2, 3]>>,
//    AssertExact<string | number, LastElement<[string, ...number[]]>>,
    AssertExact<number | string, LastElement<number[] | string[]>>
];
