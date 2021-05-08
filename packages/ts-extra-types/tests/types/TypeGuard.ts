import {AssertExact, TypeGuard} from "../../src";

type Test = [
    AssertExact<TypeGuard<"foo">, (value: number | "foo" | "bar") => value is "foo">,
    AssertExact<TypeGuard<never>, (value: number | string) => value is never>,
    AssertExact<TypeGuard<3>, (value: number | string) => value is 3>
];

export default Test;
