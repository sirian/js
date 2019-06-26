import {AssertExact, Drop} from "../../src";

type Test = [
    AssertExact<[], Drop<[], 0>>,
    AssertExact<[], Drop<[number], 0>>,
    AssertExact<[string], Drop<[number, string], 0>>,
    AssertExact<[number], Drop<[number, string], 1>>,
    AssertExact<[], Drop<[number, string], 0 | 1>>,
    AssertExact<[string?], Drop<[number, string?], 0>>,
    AssertExact<[number], Drop<[number, string?], 1>>,
    AssertExact<[number, number?], Drop<[number, string?, number?], 1>>,
    AssertExact<[number, string], Drop<[number, string], 2>>,
    AssertExact<[], Drop<[number, string], number>>,
    AssertExact<[string, ...symbol[]], Drop<[number, string, ...symbol[]], 0>>,
    AssertExact<symbol[], Drop<[number, string, ...symbol[]], 0 | 1 | 2>>
];
