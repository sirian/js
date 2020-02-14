import {AssertExact, Coalesce} from "../../src";

type Test = [
    AssertExact<Coalesce<[]>, never>,
    AssertExact<Coalesce<[null]>, null>,
    AssertExact<Coalesce<[number | null]>, number | null>,
    AssertExact<Coalesce<[number | null, string, boolean]>, number | string | null>,
];
