import {AssertExact, NodeAncestors} from "../../src";

interface Root {}

interface C1 {
    parent: Root;
}

interface C2 {
    parent: C1 | null;
}

interface C3 {
    parent: C2 | C1;
}

interface Foo {
    parent: Foo;
}

type Test = [
    AssertExact<NodeAncestors<Root, "parent">, []>,
    AssertExact<NodeAncestors<C1, "parent">, [Root]>,
    AssertExact<NodeAncestors<C2, "parent">, [] | [C1, Root]>,
    AssertExact<NodeAncestors<C3, "parent">, [C2] | [C2, C1, Root] | [C1, Root]>,
    AssertExact<NodeAncestors<Foo, "parent">, Foo[]>,
];
