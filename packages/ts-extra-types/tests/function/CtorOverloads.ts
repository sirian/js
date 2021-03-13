import {AssertExact, CtorOverloads} from "../../src";

declare class Foo {
    public name: "foo";

    constructor(x: number);
}

declare class Bar {
    public name: "bar";

    constructor();
    constructor(x: string, y: boolean);
}

declare class Baz {
    public name: "baz";

    constructor(x?: object);
    constructor(x: number);
    constructor(x: string, y: boolean);
}

type Zoo = {
    new(x: 1): Baz;
    new(x: 2): Foo;
    new(x: 3): Bar;
};

type Test = [
    AssertExact<CtorOverloads<typeof Foo>, [[number], Foo]>,
    AssertExact<CtorOverloads<typeof Bar>, [[], Bar] | [[string, boolean], Bar]>,
    AssertExact<CtorOverloads<typeof Baz>, [[number], Baz] | [[string, boolean], Baz] | [[object?], Baz]>,
    AssertExact<CtorOverloads<Zoo>, [[2], Foo] | [[3], Bar] | [[1], Baz]>,
];
