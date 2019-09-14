import {Ref} from "@sirian/common";
import {PropertyNotExistError} from "./Error";

export class StrictObject<T extends object> {
    public static from<T extends object>(target: T): T {
        return new Proxy(target, {
            get: (o, p) => {
                if (!Ref.hasOwn(o, p)) {
                    throw new PropertyNotExistError(o, p);
                }
                return Ref.get(o, p);
            },
            has: (o, p) => {
                return Ref.hasOwn(o, p);
            },
        });
    }
}
