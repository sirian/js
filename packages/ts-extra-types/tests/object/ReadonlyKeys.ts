import {AssertExact, ReadonlyKeys, Writable} from "../../src";

type Foo = {
    readonly x: number;
    y: number;
};

type Test = [
    AssertExact<ReadonlyKeys<{}>, never>,
    AssertExact<ReadonlyKeys<{ x: number }>, never>,
    AssertExact<ReadonlyKeys<{ readonly x: number }>, "x">,

    AssertExact<ReadonlyKeys<{ x: number, y: string }>, never>,
    AssertExact<ReadonlyKeys<{ readonly x: number, y: string }>, "x">,
    AssertExact<ReadonlyKeys<{ readonly x: number, readonly y: string }>, "x" | "y">,
    AssertExact<ReadonlyKeys<{ x: number, readonly y: string }>, "y">,

    AssertExact<ReadonlyKeys<Foo>, "x">,
    AssertExact<ReadonlyKeys<Partial<Foo>>, "x">,
    AssertExact<ReadonlyKeys<Readonly<Foo>>, "x" | "y">,
    AssertExact<ReadonlyKeys<Writable<Foo>>, never>,

    AssertExact<ReadonlyKeys<Record<string, number>>, never>,
    AssertExact<ReadonlyKeys<Partial<Record<string, number>>>, never>,

    AssertExact<ReadonlyKeys<[]>, never>,
    AssertExact<ReadonlyKeys<number[]>, never>,
    AssertExact<ReadonlyKeys<[number]>, never>,
    AssertExact<ReadonlyKeys<[number]>, never>,
    AssertExact<ReadonlyKeys<[number?]>, never>,
    AssertExact<ReadonlyKeys<[number?]>, never>,
    AssertExact<ReadonlyKeys<[number]>, never>,
    AssertExact<ReadonlyKeys<[number?]>, never>,
    AssertExact<ReadonlyKeys<[number, boolean]>, never>,
];
