import {AssertExact, Entry, ObjEntryOf} from "../../src";

interface IFoo {
    a: number;
    b: boolean;
    c?: "x" | "y";
}

declare type Test = [
    AssertExact<ObjEntryOf<IFoo>, Entry<"a", number> | Entry<"b", boolean> | Entry<"c", "x" | "y" | undefined>>,

    AssertExact<ObjEntryOf<Pick<IFoo, "a" | "b">>, Entry<"a", number> | Entry<"b", boolean>>,

    AssertExact<ObjEntryOf<Pick<IFoo, "a">>, Entry<"a", number>>,

    AssertExact<ObjEntryOf<boolean[]>, Entry<`${number}`, boolean>>,
    AssertExact<ObjEntryOf<[boolean, number]>, Entry<"0", boolean> | Entry<"1", number>>,
    AssertExact<ObjEntryOf<[boolean, number, ...string[]]>, Entry<"0", boolean> | Entry<"1", number> | Entry<`${number}`, string | boolean | number>>,

    AssertExact<ObjEntryOf<Pick<IFoo, never>>, never>,

    AssertExact<ObjEntryOf<Record<string, boolean>>, Entry<string, boolean>>
];
