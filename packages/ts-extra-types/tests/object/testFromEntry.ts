import {AssertExact, FromEntry} from "../../src";

type Test = [
    AssertExact<{}, FromEntry<[never, any]>>,

    AssertExact<{ foo: number }, FromEntry<["foo", number]>>,
    AssertExact<{ 0: number }, FromEntry<[0, number]>>,

    AssertExact<{ [id: number]: string }, FromEntry<[number, string]>>,
    AssertExact<Record<number, string>, FromEntry<[number, string]>>,

    AssertExact<{ a: number } | { a: undefined } | { b: boolean },
        FromEntry<["a", number] | ["a", undefined] | ["b", boolean]>>
];
