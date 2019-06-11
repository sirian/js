import {XPromise} from "../../src";

class AsyncXPromise extends XPromise {
    protected react(value: any) {
        process.nextTick(() => super.react(value));
    }
}

export = {
    deferred: () => new AsyncXPromise(),
};
