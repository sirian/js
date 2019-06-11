import {AssertExact, ToNumberRecord} from "../../src";

type Test = [
    AssertExact<{ 0: 1 }, ToNumberRecord<{ "0": 1 }>>,
    AssertExact<{ 0: 1, 1: 1 }, ToNumberRecord<{ "0": 1, 1: 1 }>>,
    AssertExact<{ 0?: 1, 1: 1 | undefined }, ToNumberRecord<{ "0"?: 1, 1: 1 | undefined }>>,
    AssertExact<{ 0: 1, 1: 2, 2: 3 }, ToNumberRecord<[1, 2, 3]>>,
    AssertExact<Record<number, boolean>, ToNumberRecord<Record<string, boolean>>>
];
