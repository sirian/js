import {AssertExact, NodeParents} from "../../src";

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
    AssertExact<NodeParents<Root, "parent">, [Root]>,
    AssertExact<NodeParents<C1, "parent">, [C1, Root]>,
    AssertExact<NodeParents<C2, "parent">, [C2] | [C2, C1, Root]>,
    AssertExact<NodeParents<C3, "parent">, [C3, C2] | [C3, C2, C1, Root] | [C3, C1, Root]>,
    AssertExact<NodeParents<Foo, "parent">, Foo[]>,
];
