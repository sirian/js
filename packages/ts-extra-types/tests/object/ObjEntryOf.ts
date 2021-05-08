import {AssertExact, ObjEntryOf} from "../../src";

interface IFoo {
    a: number;
    b: boolean;
    c?: "x" | "y";
}

type Test = [
    AssertExact<ObjEntryOf<IFoo>, ["a", number] | ["b", boolean] | ["c", "x" | "y" | undefined]>,

    AssertExact<ObjEntryOf<Pick<IFoo, "a" | "b">>, ["a", number] | ["b", boolean]>,

    AssertExact<ObjEntryOf<Pick<IFoo, "a">>, ["a", number]>,

    AssertExact<ObjEntryOf<boolean[]>, [`${number}`, boolean]>,
    AssertExact<ObjEntryOf<[boolean, number]>, ["0", boolean] | ["1", number]>,
    AssertExact<ObjEntryOf<[boolean, number, ...string[]]>, ["0", boolean] | ["1", number] | [`${number}`, string]>,

    AssertExact<ObjEntryOf<Pick<IFoo, never>>, never>,

    AssertExact<ObjEntryOf<Record<string, boolean>>, [string, boolean]>
];

export default Test;
