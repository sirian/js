import {ImmediateCallback} from "@sirian/process";
import {Return} from "@sirian/ts-extra-types";

export class TimeoutImmediate {
    public static supports() {
        return true;
    }

    public set(fn: ImmediateCallback) {
        return setTimeout(fn, 0);
    }

    public clear(id: Return<typeof setTimeout>) {
        return clearTimeout(id);
    }
}
