import {ArrayToObject, AssertExact} from "../../src";

declare type Test = [
    AssertExact<{}, ArrayToObject<[]>>,
    AssertExact<{ "0": 1 }, ArrayToObject<[1]>>,
    AssertExact<{ "0"?: 1 }, ArrayToObject<[1?]>>,
    AssertExact<{ "0": 1, "1": 2 }, ArrayToObject<[1, 2]>>,
    AssertExact<{ "0": 1, "1"?: 2 }, ArrayToObject<[1, 2?]>>,
    AssertExact<{ [x: number]: 1 | 2 } & { "0": 1 }, ArrayToObject<[1, ...2[]]>>,
    AssertExact<{ [x: number]: 1 }, ArrayToObject<1[]>>,
    AssertExact<{ [x: number]: 1 }, ArrayToObject<1[]>>,
    AssertExact<{ "0": 1 }, ArrayToObject<[1 | 2] & { 0: 1 | 3 }>>
];
