import {AssertExact, DeepPartial} from "../../src";

type Test = [
    AssertExact<{}, DeepPartial<{}>>,
    AssertExact<{ x?: number }, DeepPartial<{ x?: number }>>,
    AssertExact<{ x?: number }, DeepPartial<{ x: number }>>,
    AssertExact<{ x?: number, y?: { z?: number } }, DeepPartial<{ x?: number, y?: { z?: number } }>>,
    AssertExact<{ x?: number, y?: { z?: number } }, DeepPartial<{ x?: number, y: { z?: number } }>>,
    AssertExact<{ x?: number, y?: { z?: number } }, DeepPartial<{ x?: number, y?: { z: number } }>>,

    AssertExact<[], DeepPartial<[]>>,
    AssertExact<[1?], DeepPartial<[1]>>,
    AssertExact<[1?], DeepPartial<[1?]>>,
    AssertExact<[1?, 2?, [3?, 4?]?, 5?], DeepPartial<[1?, 2?, [3?, 4?]?, 5?]>>,
];

export default Test;
