import {AssertExact, TupleEntryOf} from "../../src";

type Test = [
    AssertExact<never, TupleEntryOf<[]>>,
    AssertExact<["0", true], TupleEntryOf<[true]>>,
    AssertExact<["0", true] | ["1", false], TupleEntryOf<[true, false]>>,
    AssertExact<[string, number], TupleEntryOf<number[]>>,
    AssertExact<["0", boolean] | [string, number], TupleEntryOf<[boolean, ...number[]]>>
];
