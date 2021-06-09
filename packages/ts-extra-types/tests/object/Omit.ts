import {AssertExact, MyOmit} from "../../src";

interface Foo {
    0: true;
    x: number | string;
    y: number;
    z?: boolean | null;
}

declare type Test = [
    AssertExact<Foo, MyOmit<Foo, never>>,
    AssertExact<Foo, MyOmit<Foo, 1>>,
    AssertExact<Foo, MyOmit<Foo, "1">>,
    AssertExact<[], MyOmit<[], never>>,
    AssertExact<[1], MyOmit<[1], never>>,
    AssertExact<{ y: number, z?: boolean | null }, MyOmit<Foo, 0 | "x">>,
    AssertExact<{ y: number, z?: boolean | null }, MyOmit<Foo, "0" | "x">>,
    AssertExact<{ 0: true, y: number, z?: boolean | null }, MyOmit<Foo, "x">>,
    AssertExact<{ x: number | string, 0: any }, MyOmit<Foo, "y" | "z">>,
    AssertExact<{ 0: true, x: number | string, y: number }, MyOmit<Foo, "z">>,
    AssertExact<{ 0: any }, MyOmit<Foo, "x" | "y" | "z">>,
    AssertExact<{}, MyOmit<Foo, keyof Foo>>
];
