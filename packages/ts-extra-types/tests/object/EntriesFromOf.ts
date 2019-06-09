import {AssertExact, EntriesOf, FromEntries} from "../../src";

type Foo = {
    x: number;
    y: string;
    z: boolean | undefined;
};
type Test = [
    AssertExact<Foo, FromEntries<EntriesOf<Foo>>>,
    AssertExact<{ "0": boolean, "1": string }, FromEntries<EntriesOf<[boolean, string]>>>,
    AssertExact<Record<string, number>, FromEntries<EntriesOf<number[]>>>,
    AssertExact<{ "0": boolean, "1": string }, FromEntries<EntriesOf<{ 0: boolean, 1: string }>>>
];
