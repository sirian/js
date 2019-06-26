import {ArrayEntryOf, AssertExact} from "../../src";

type Test = [
    AssertExact<never, ArrayEntryOf<[]>>,
    AssertExact<["0", true], ArrayEntryOf<[true]>>,
    AssertExact<["0", true] | ["1", false] | ["2", boolean], ArrayEntryOf<[true, false, boolean]>>,
    AssertExact<[string, number], ArrayEntryOf<number[]>>,
    AssertExact<[string, 1], ArrayEntryOf<[1, ...1[]]>>,
    AssertExact<["0", 1] | [string, 1 | 2], ArrayEntryOf<[1, ...2[]]>>
];
