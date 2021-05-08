import {AssertExact, Exclusive} from "../../src";

type Foo = { x: string, y: boolean };
type Bar = { y: boolean; z?: number };

type Test = [
    AssertExact<Exclusive<Foo, Bar>, Foo & { z?: never } | Bar & { x?: never, y: boolean }>,
    AssertExact<Exclusive<Foo, Bar>, Foo & { z?: never } | Bar & { x?: never, y: boolean }>
];

export default Test;
