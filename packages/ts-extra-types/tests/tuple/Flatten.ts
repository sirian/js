import {AssertExact, Flatten} from "../../src";

type Test = [
    AssertExact<string[], Flatten<string[]>>,
    AssertExact<string[], Flatten<string[][]>>,
    AssertExact<string[], Flatten<string[][][]>>,
    AssertExact<string[] | number[], Flatten<string[] | number[]>>,
    AssertExact<string[] | ReadonlyArray<number | boolean>, Flatten<string[][] | readonly (number[] | boolean[][])[]>>,
    AssertExact<Array<1 | 2 | 3 | 4>, Flatten<[1, [2, [3], 4]]>>,
];

export default Test;
