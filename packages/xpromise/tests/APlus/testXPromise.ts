import {XPromise} from "../../src";
import {Adapter} from "./Adapter";

// @ts-ignore
const react = XPromise.prototype._react;

beforeAll(() => {
    // @ts-ignore
    XPromise.prototype._react = new Proxy(react, {
        apply: (target, thisArg, args) => queueMicrotask(target.bind(thisArg, ...args)),
    });
});
afterAll(() => {
    // @ts-ignore
    XPromise.prototype._react = react;
});
Adapter.run(() => new XPromise());
