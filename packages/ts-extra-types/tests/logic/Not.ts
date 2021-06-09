import {AssertExact, Not} from "../../src";

declare type Test = [
    AssertExact<true, Not<false>>,
    AssertExact<false, Not<true>>,
    AssertExact<boolean, Not<boolean>>,
];
