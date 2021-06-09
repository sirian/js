import {AssertExact, StrReverse} from "@sirian/ts-extra-types";

declare type Test = [
    AssertExact<string, StrReverse<string>>,
    AssertExact<"", StrReverse<"">>,
    AssertExact<"a", StrReverse<"a">>,
    AssertExact<"ab", StrReverse<"ba">>,
    AssertExact<"abc", StrReverse<"cba">>,
    AssertExact<"abcd", StrReverse<"dcba">>,
    AssertExact<"abcde", StrReverse<"edcba">>,
    AssertExact<"abcdef", StrReverse<"fedcba">>,
];
