import {AssertExact, NodePath} from "../../src";

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
    AssertExact<NodePath<Root>, [Root]>,
    AssertExact<NodePath<C1>, [C1, Root]>,
    AssertExact<NodePath<C2>, [C2, C1, Root]>,
    AssertExact<NodePath<Foo>, Foo[]>,
];

export default Test;
