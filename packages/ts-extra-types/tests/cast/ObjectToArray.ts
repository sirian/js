import {AssertExact, ObjectToArray} from "../../src";

type Test = [
    AssertExact<[], ObjectToArray<[]>>,
    AssertExact<[], ObjectToArray<{ length: 0 }>>,
    AssertExact<[1], ObjectToArray<[1]>>,
    AssertExact<[1], ObjectToArray<{ 0: 1, length: 1 }>>,
    AssertExact<[1], ObjectToArray<{ 0: 1, length: 1 }>>,
    AssertExact<[1?], ObjectToArray<[1?]>>,
    AssertExact<[0, 1?], ObjectToArray<[0, 1?]>>,
    AssertExact<[0?, 1?], ObjectToArray<[0?, 1?]>>,

    AssertExact<[never], ObjectToArray<{ length: 1 }>>,
    AssertExact<[true], ObjectToArray<{ 0: boolean } & { 0: true, length: 1 }>>,
    AssertExact<[true], ObjectToArray<[boolean] & { "0": true }>>,
    AssertExact<[true], ObjectToArray<[boolean] & { 0: true }>>,
    AssertExact<[true], ObjectToArray<{ 0: true, length: 1 }>>,
    AssertExact<[any, number], ObjectToArray<{ 1: number, length: 2 }>>,
    AssertExact<[1 | 3, 2?], ObjectToArray<[1 | 3, 2?]>>,
    AssertExact<[true, false?], ObjectToArray<{ 0: true, 1?: false, length: 1 | 2 }>>,

    AssertExact<[1, 2?], ObjectToArray<{ 0: 1, 1?: 2, length: 1 | 2 }>>,
    AssertExact<[1, 2], ObjectToArray<[1 | 3, 2] & { 0: 1 }>>,

    AssertExact<ObjectToArray<number[]>, number[]>
];
