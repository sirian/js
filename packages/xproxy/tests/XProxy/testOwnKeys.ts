import {XProxy} from "../../src";

describe("xProxy.ownKeys", () => {
    test("xProxy.ownKeys", () => {
        const o = {x: 1, y: 2};
        const p = XProxy.forObject({target: o});
        expect(Reflect.ownKeys(p)).toStrictEqual(Reflect.ownKeys(o));
    });
});
