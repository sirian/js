import {AssertExact, Ensure} from "../../src";

type Tests = [
    AssertExact<string, Ensure<string, "length">>,

    AssertExact<{ y: boolean | number | undefined }, Ensure<{ y?: boolean | number }, "y">>,

    AssertExact<{ y: boolean | number | undefined }, Ensure<{ y: boolean | number | undefined }, "y">>,

    AssertExact<{ y: unknown }, Ensure<{}, "y">>,

    AssertExact<{ x: number, y: unknown }, Ensure<{ x: number }, "y">>,

    AssertExact<{ x: number }, Ensure<{ x: number }, "x">>,

    AssertExact<{ x: number | undefined }, Ensure<{ x?: number }, "x">>,

    AssertExact<{ x: number | undefined }, Ensure<{ x?: number }, "x">>,

    AssertExact<{ y: unknown }, Ensure<{}, "y">>,

    AssertExact<{ y: unknown } & object, Ensure<object, "y">>,

    AssertExact<{ y: unknown } & number, Ensure<number, "y">>,

    AssertExact<{ length: number | undefined } | { foo: string, length: unknown },
        Ensure<{ length?: number } | { foo: string }, "length">>,

    AssertExact<{ name: "test" | undefined, x?: number, z: string },
        Ensure<null | { name?: "test", x?: number, z: string }, "name">>,

    AssertExact<{ toFixed: undefined | (() => any) },
        Ensure<null | { toFixed?: () => any }, "toFixed">>,

    AssertExact<number | { toFixed: undefined | (() => any) },
        Ensure<null | number | { toFixed?: () => any }, "toFixed">>,

    AssertExact<number | { toFixed: undefined | (() => any) } | { foo: string, toFixed: unknown },
        Ensure<null | number | { toFixed?: () => any } | { foo: string }, "toFixed">>,

    AssertExact<number | { toFixed?: (() => any), toPrecision: unknown },
        Ensure<null | number | { toFixed?: () => any }, "toPrecision">>
];
