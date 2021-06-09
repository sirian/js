import {AssertExact, NodeDepth} from "../../src";

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

declare type Test = [
    AssertExact<NodeDepth<Root, "parent">, 0>,
    AssertExact<NodeDepth<C1, "parent">, 1>,
    AssertExact<NodeDepth<C2, "parent">, 0 | 2>,
    AssertExact<NodeDepth<C3, "parent">, 1 | 2 | 3>,
    AssertExact<NodeDepth<Foo, "parent">, number>,
];
