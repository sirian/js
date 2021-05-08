import {AssertExact, Func, PickTyped} from "../../src";

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
    AssertExact<Pick<Foo, "c" | "d" | "e">, PickTyped<Foo, boolean>>,

    AssertExact<Pick<Foo, "c">, PickTyped<Foo, true>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "l">, PickTyped<Foo, (x: number) => any>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "l">, PickTyped<Foo, (x: number, y?: string) => any>>,

    AssertExact<Pick<Foo, "f" | "h" | "i" | "j" | "k" | "l">, PickTyped<Foo, (x: number, y: string) => any>>,

    AssertExact<Pick<Foo, "f" | "j" | "l">, PickTyped<Foo, (x?: number) => any>>,

    AssertExact<Pick<Foo, "f" | "g" | "h" | "i" | "j" | "k" | "l">, PickTyped<Foo, Func>>,

    AssertExact<Pick<Foo, "f" | "l">, PickTyped<Foo, Func<any, [boolean]>>>,

    AssertExact<Pick<Foo, "f" | "j" | "l">, PickTyped<Foo, () => any>>,

    AssertExact<{ y: string }, PickTyped<{ x: number; y: string; z: boolean | string }, string>>,

    AssertExact<{ x: true, y: string, z: boolean }, PickTyped<{ x: true; y: string; z: boolean }, boolean | string>>
];

export default Test;
