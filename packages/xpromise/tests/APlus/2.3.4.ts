import {isFunction} from "@sirian/common";
import {Func0} from "@sirian/ts-extra-types";
import {testFulfilled, testRejected} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.3.4: If `x` is not an object or function, fulfill `promise` with `x`", () => {
    const data: Array<[string, any, Func0?, Func0?]> = [
        ["`undefined`", undefined],
        ["`null`", null],
        ["`false`", false],
        ["`true`", true],
        ["`0`", 0],
        [
            "`true` with `Boolean.prototype` modified to have a `then` method",
            true,
            () => (Boolean.prototype as any).then = () => void 0,
            () => delete (Boolean.prototype as any).then,
        ],
        [
            "`1` with `Number.prototype` modified to have a `then` method",
            1,
            () => (Number.prototype as any).then = () => void 0,
            () => delete (Number.prototype as any).then,
        ],
    ];

    describe.each(data)("The value is %o", (expectedValue, stringRepresentation, beforeEachHook?: Func0, afterEachHook?: Func0) => {
        if (isFunction(beforeEachHook)) {
            beforeEach(beforeEachHook);
        }
        if (isFunction(afterEachHook)) {
            afterEach(afterEachHook);
        }

        testFulfilled(dummy, (promise1, done) => {
            const promise2 = promise1.then(() => expectedValue);

            promise2.then(actualValue => {
                expect(actualValue).toBe(expectedValue);
                done();
            });
        });

        testRejected(dummy, (promise1, done) => {
            const promise2 = promise1.then(null, () => expectedValue);

            promise2.then(actualValue => {
                expect(actualValue).toBe(expectedValue);
                done();
            });
        });
    });
});
