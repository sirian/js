import {AssertExact, EntryOf, IsOpenTuple} from "../../src";

interface IFoo {
    a: number;
    b: boolean;
    c?: "x" | "y";
}

type Test = [
    AssertExact<EntryOf<IFoo>, ["a", number] | ["b", boolean] | ["c", "x" | "y" | undefined]>,

    AssertExact<EntryOf<Pick<IFoo, "a" | "b">>, ["a", number] | ["b", boolean]>,

    AssertExact<EntryOf<Pick<IFoo, "a">>, ["a", number]>,

    AssertExact<EntryOf<boolean[]>, [string, boolean]>,
    AssertExact<EntryOf<[boolean, number]>, ["0", boolean] | ["1", number]>,

    AssertExact<EntryOf<Pick<IFoo, never>>, never>,

    AssertExact<EntryOf<Record<string, boolean>>, [string, boolean]>
];
