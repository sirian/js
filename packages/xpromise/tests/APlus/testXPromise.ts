import {XPromise} from "../../src";
import {Adapter} from "./Adapter";

class AsyncXPromise extends XPromise {
    protected react(value: any) {
        queueMicrotask(() => super.react(value));
    }
}

Adapter.run(() => new AsyncXPromise());
