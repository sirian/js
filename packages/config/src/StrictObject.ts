import {getProp, hasOwn} from "@sirian/common";
import {PropertyNotExistError} from "./Error";

export class StrictObject<T extends object> {
    public static from<T extends object>(target: T): T {
        return new Proxy(target, {
            get: (o, p) => {
                if (!hasOwn(o, p)) {
                    throw new PropertyNotExistError(o, p);
                }
                return getProp(o, p);
            },
            has: (o, p) => {
                return hasOwn(o, p);
            },
        });
    }
}
