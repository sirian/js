import {Return} from "@sirian/ts-extra-types";
import {ImmediateAdapter, ImmediateCallback} from "./Immediate";

export class TimeoutImmediate implements ImmediateAdapter<Return<typeof setTimeout>> {
    public static supports() {
        return "function" === typeof setTimeout && "function" === typeof clearTimeout;
    }

    public set(fn: ImmediateCallback) {
        return setTimeout(fn, 0);
    }

    public clear(id: Return<typeof setTimeout>) {
        return clearTimeout(id);
    }
}
