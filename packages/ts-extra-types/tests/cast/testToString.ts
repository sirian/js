import {AssertExact, ToString} from "../../src";

type Test = [
    AssertExact<"null", ToString<null>>,
    AssertExact<"undefined", ToString<undefined>>,
    AssertExact<"true", ToString<true>>,
    AssertExact<"false", ToString<false>>,
    AssertExact<"1", ToString<1>>,
    AssertExact<string, ToString<number>>,

    AssertExact<"1", ToString<"1">>,
    AssertExact<string, ToString<string>>
];
