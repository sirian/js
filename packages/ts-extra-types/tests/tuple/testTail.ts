import {AssertExact, Tail} from "../../src";

type Test = [
    AssertExact<Tail<[]>, []>,
    AssertExact<Tail<[number]>, []>,
    AssertExact<Tail<[boolean?]>, []>,
    AssertExact<Tail<[1?, 2?]>, [2?]>,
    AssertExact<Tail<[1, 2, 3?]>, [2, 3?]>,
    AssertExact<Tail<[number, boolean?]>, [boolean?]>,
    AssertExact<Tail<[number, string | boolean]>, [string | boolean]>,
    AssertExact<Tail<[number, string, boolean]>, [string, boolean]>,
    AssertExact<Tail<[number, boolean, ...number[]]>, [boolean, ...number[]]>,
    AssertExact<Tail<[number, number, ...number[]]>, [number, ...number[]]>,
    AssertExact<Tail<[number, ...number[]]>, [...number[]]>,
    AssertExact<Tail<[...number[]]>, [...number[]]>,
    AssertExact<Tail<number[]>, number[]>
];
