import {AssertExact, Writable, WritableKeys} from "../../src";

type Foo = {
    readonly x: number;
    y: number;
};

type Test = [
    AssertExact<WritableKeys<{}>, never>,
    AssertExact<WritableKeys<{ x: number }>, "x">,
    AssertExact<WritableKeys<{ readonly x: number }>, never>,

    AssertExact<WritableKeys<{ x: number, y: string }>, "x" | "y">,
    AssertExact<WritableKeys<{ readonly x: number, y: string }>, "y">,
    AssertExact<WritableKeys<{ readonly x: number, readonly y: string }>, never>,
    AssertExact<WritableKeys<{ x: number, readonly y: string }>, "x">,

    AssertExact<WritableKeys<Foo>, "y">,
    AssertExact<WritableKeys<Partial<Foo>>, "y">,
    AssertExact<WritableKeys<Readonly<Foo>>, never>,
    AssertExact<WritableKeys<Writable<Foo>>, "x" | "y">,

    AssertExact<WritableKeys<Record<number, number>>, number>,
    AssertExact<WritableKeys<Partial<Record<number, number>>>, number>,

    AssertExact<WritableKeys<[]>, keyof []>,
    AssertExact<WritableKeys<number[]>, keyof number[]>,
    AssertExact<WritableKeys<[number]>, keyof [number]>,
    AssertExact<WritableKeys<[number]>, keyof [number?]>,
    AssertExact<WritableKeys<[number?]>, keyof [number]>,
    AssertExact<WritableKeys<[number?]>, keyof [number?]>,
    AssertExact<WritableKeys<[number]>, "0" | keyof []>,
    AssertExact<WritableKeys<[number?]>, "0" | keyof []>,
    AssertExact<WritableKeys<[number, boolean]>, "0" | "1" | keyof []>
];
