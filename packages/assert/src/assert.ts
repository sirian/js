import {AssertError} from "./AssertError";

export function assert(condition: any, callback: () => Error): asserts condition;
export function assert(condition: any, message?: string, ...data: any[]): asserts condition;
export function assert(condition: any, message?: any, ...data: any[]) {
    if (!condition) {
        if ("function" === typeof message) {
            throw message();
        }
        throw new AssertError(condition, message, data);
    }
}
