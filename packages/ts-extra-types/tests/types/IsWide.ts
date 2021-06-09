import {AssertExact, IsWide} from "../../src";

declare type Test = [
    AssertExact<true, IsWide<boolean>>,
    AssertExact<true, IsWide<string>>,
    AssertExact<true, IsWide<number>>,

    AssertExact<false, IsWide<42>>,
    AssertExact<false, IsWide<"42">>,
    AssertExact<false, IsWide<true>>,
    AssertExact<false, IsWide<false>>
];
