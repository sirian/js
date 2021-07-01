import {XPromise} from "../../src";
import {Adapter} from "./Adapter";

const proto = XPromise.prototype as any;

const react = proto._react;

beforeAll(() => {
    proto._react = new Proxy(react, {
        apply: (target, thisArg, args) => queueMicrotask(target.bind(thisArg, ...args)),
    });
});
afterAll(() => {
    proto._react = react;
});
Adapter.run(() => new XPromise());
