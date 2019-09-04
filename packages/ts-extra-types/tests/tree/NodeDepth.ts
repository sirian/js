import {AssertExact, NodeDepth} from "../../src";

interface Root {}

interface C1 {
    parent: Root;
}

interface C2 {
    parent: C1;
}

interface Foo {
    parent: Foo;
}

type Test = [
    AssertExact<NodeDepth<Root>, 0>,
    AssertExact<NodeDepth<C1>, 1>,
    AssertExact<NodeDepth<C2>, 2>,
    AssertExact<NodeDepth<Foo>, number>,
];
