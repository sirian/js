import {AssertExact, LastElement} from "../../src";

type Test = [
    AssertExact<never, LastElement<[]>>,
    AssertExact<number, LastElement<[number]>>,
    AssertExact<boolean, LastElement<[number, boolean]>>,
    AssertExact<string, LastElement<[number, boolean, string]>>,
    AssertExact<boolean, LastElement<boolean[]>>,
    AssertExact<1, LastElement<[1]>>,
    AssertExact<1 | undefined, LastElement<[1?]>>,
    AssertExact<2 | undefined, LastElement<[1, 2?]>>,
    AssertExact<3, LastElement<[2, 3]>>,
    AssertExact<number, LastElement<[string, ...number[]]>>,
    AssertExact<number | string, LastElement<number[] | string[]>>
];
