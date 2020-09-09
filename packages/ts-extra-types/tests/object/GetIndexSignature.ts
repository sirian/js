import {AssertExact, GetIndexSignature} from "../../src";

type Test = [
    AssertExact<{}, GetIndexSignature<{}>>,
    AssertExact<{}, GetIndexSignature<{ "foo": 1; 0: 1 }>>,
    AssertExact<{ [id: number]: 1 }, GetIndexSignature<{ [id: number]: 1; "foo": number; "0": 1 }>>,
    AssertExact<{ [id: string]: 1 }, GetIndexSignature<{ [id: string]: 1; "foo": 1; 0: 1 }>>,
    AssertExact<{ [id: number]: 1 }, GetIndexSignature<1[]>>,
    AssertExact<Record<number, 1>, GetIndexSignature<Record<number, 1>>>,
    AssertExact<Record<string, 2>, GetIndexSignature<Record<string, 2>>>
];
