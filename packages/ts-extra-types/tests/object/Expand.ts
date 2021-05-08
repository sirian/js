import {ArrayToObject, AssertExact, Expand} from "../../src";

type Test = [
    AssertExact<{}, Expand<{}>>,
    AssertExact<0 | "0", keyof Expand<{ 0: 1 }>>,
    AssertExact<{ "0": 1 } & { 0: 1 }, Expand<{ 0: 1 }>>,
    AssertExact<{ "0": true } & { 0: true } & { "1": false } & { 1: false }, Expand<{ 0: true, "1": false }>>,
    AssertExact<Record<string, 1> & Record<number, 1>, Expand<{ [id: string]: 1 }>>,
    AssertExact<{ [id: number]: 1 }, Expand<{ [id: number]: 1 }>>,
    AssertExact<Record<string, 1>, Expand<Record<string, 1>>>,
    AssertExact<Record<number, 1>, Expand<Record<number, 1>>>,
    AssertExact<{ "0": true } & { 0: true }, Expand<ArrayToObject<[true]>>>,
    AssertExact<[true] & { 0: true }, Expand<[true]>>,
    AssertExact<{ 0: 1 } & { "0": 1 } & { [x: number]: 1 | 2 }, Expand<ArrayToObject<[1, ...2[]]>>>,
    AssertExact<{ [id: number]: true } & { [id: number]: true }, Expand<ArrayToObject<true[]>>>
];
