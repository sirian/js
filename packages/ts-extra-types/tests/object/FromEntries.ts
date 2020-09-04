import {AssertExact, FromEntries} from "../../src";

type Test = [
    AssertExact<{}, FromEntries<[]>>,

    AssertExact<{ foo: number }, FromEntries<[["foo", number]]>>,

    AssertExact<{ bar: string }, FromEntries<Array<["bar", string]>>>,
    AssertExact<{ foo: number, bar: string }, FromEntries<[["foo", number], ...["bar", string][]]>>,

    AssertExact<{ foo: number, bar: string }, FromEntries<[["bar", string], ["foo", number]]>>,

    AssertExact<{ [id: number]: string }, FromEntries<Array<[number, string]>>>,

    AssertExact<Record<number, string>, FromEntries<Array<[number, string]>>>,

    AssertExact<{ a: number | undefined }, FromEntries<Array<["a", number | undefined]>>>
];
