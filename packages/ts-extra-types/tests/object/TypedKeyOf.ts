import {AssertExact, Func, TypedKeyOf} from "../../src";

interface Foo {
    a: 1;
    b: "";
    c: true;
    d: false;
    e: boolean;
    f: () => void;
    g: (x: string) => void;
    h: (x: string | number) => void;
    i: (x: number) => void;
    j: (x?: number) => void;
    k: (x: number, y: string) => void;
    l: (...args: any[]) => void;
}

type Test = [
    AssertExact<"c" | "d" | "e", TypedKeyOf<Foo, boolean>>,

    AssertExact<"c", TypedKeyOf<Foo, true>>,

    AssertExact<"f" | "h" | "i" | "j" | "l", TypedKeyOf<Foo, (x: number) => any>>,

    AssertExact<"f" | "h" | "i" | "j" | "l", TypedKeyOf<Foo, (x: number, y?: string) => any>>,

    AssertExact<"f" | "h" | "i" | "j" | "k" | "l", TypedKeyOf<Foo, (x: number, y: string) => any>>,

    AssertExact<"f" | "j" | "l", TypedKeyOf<Foo, (x?: number) => any>>,

    AssertExact<"f" | "g" | "h" | "i" | "j" | "k" | "l", TypedKeyOf<Foo, Func>>,

    AssertExact<"f" | "l", TypedKeyOf<Foo, Func<any, [boolean]>>>,

    AssertExact<"f" | "j" | "l", TypedKeyOf<Foo, () => any>>,

    AssertExact<"y", TypedKeyOf<{ x: number; y: string; z: boolean | string }, string>>,

    AssertExact<"y" | "z", TypedKeyOf<{ x: number; y: string; z: boolean | string }, boolean | string>>
];

export default Test;
