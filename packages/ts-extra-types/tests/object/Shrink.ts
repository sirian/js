import {AssertExact, Func, Shrink} from "../../src";

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
    AssertExact<Pick<Foo, "c" | "d" | "e">, Shrink<Foo, boolean>>,

    AssertExact<Pick<Foo, "c">, Shrink<Foo, true>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "l">, Shrink<Foo, (x: number) => any>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "l">, Shrink<Foo, (x: number, y?: string) => any>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "k" | "l">, Shrink<Foo, (x: number, y: string) => any>>,

    AssertExact<Pick<Foo, "f" | "j" | "l">, Shrink<Foo, (x?: number) => any>>,

    AssertExact<Pick<Foo, "f" | "g" | "h" | "i" | "j" | "k" | "l">, Shrink<Foo, Func>>,

    AssertExact<Pick<Foo, "f" | "l">, Shrink<Foo, Func<any, [boolean]>>>,

    AssertExact<Pick<Foo, "f" | "j" | "l">, Shrink<Foo, () => any>>,

    AssertExact<{ y: string }, Shrink<{ x: number; y: string; z: boolean | string }, string>>,

    AssertExact<{ x: true, y: string, z: boolean }, Shrink<{ x: true; y: string; z: boolean }, boolean | string>>
];
