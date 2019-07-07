import {AssertExact, GetIndexSignature} from "../../src";

type Test = [
    AssertExact<{}, GetIndexSignature<{}>>,
    AssertExact<{[id: number]: 1}, GetIndexSignature<{ [id: number]: 1; "foo": number; "0": 1 }>>,
    AssertExact<{[id: string]: 1}, GetIndexSignature<{ [id: string]: 1; "foo": 1; 0: 1 }>>,
    AssertExact<{[id: number]: 1}, GetIndexSignature<1[]>>,
    AssertExact<Record<number, number>, GetIndexSignature<Record<number, number>>>,
    AssertExact<Record<string, number>, GetIndexSignature<Record<string, number>>>
];
