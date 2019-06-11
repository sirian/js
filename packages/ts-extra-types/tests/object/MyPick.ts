import {AssertExact, MyPick} from "../../src";

interface Foo {
    0: true;
    "1": false;
    x: number | string;
    y: number;
    z?: boolean | null;
}

type Test = [
    AssertExact<{}, MyPick<Foo, never>>,
    AssertExact<{ 0: 1 }, MyPick<{ 0: 1, 1: 2 }, 0>>,
    AssertExact<{ 0: 1 }, MyPick<{ 0: 1, 1: 2 }, "0">>,
    AssertExact<{ 0: 1, 1: 2 }, MyPick<{ 0: 1, 1: 2 }, "0" | 1>>,
    AssertExact<{}, MyPick<{ 0: 1, 1: 2 }, 2>>,
    AssertExact<{"0": 1}, MyPick<[1, 2], "0">>,
    AssertExact<{"0": 1}, MyPick<[1, 2], 0>>,
    AssertExact<{}, MyPick<[1, 2], 2>>,
    AssertExact<{}, MyPick<[1, 2], "2">>,
    AssertExact<{}, MyPick<{ 0: 1, 1: 2 }, "2">>,
    AssertExact<{ "1": false }, MyPick<Foo, 1>>,
    AssertExact<{ "1": false }, MyPick<Foo, "1">>,
    AssertExact<{ 0: true }, MyPick<Foo, 0>>,
    AssertExact<{ 0?: true }, MyPick<{0?: true}, 0>>,
    AssertExact<{ 0?: true }, MyPick<{0?: true}, "0">>,
    AssertExact<{ 0: true }, MyPick<Foo, "0">>,
    AssertExact<{ "1": false }, MyPick<Foo, "1">>,
    AssertExact<{ x: number | string, y: number }, MyPick<Foo, "y" | "x">>,
    AssertExact<{ z?: boolean | null }, MyPick<Foo, "z">>
];
