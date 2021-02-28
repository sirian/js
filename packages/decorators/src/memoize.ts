import {isFunction} from "@sirian/common";
import {createMemoizer, IMemoizerOptions} from "./createMemoizer";
import {methodDecorator} from "./decorator";

export const memoize = methodDecorator((options?: IMemoizerOptions<any>) =>
    (target, key, descriptor) => {
        for (const k of ["get", "value"] as const) {
            const v = descriptor[k];
            if (isFunction(v)) {
                return {
                    ...descriptor,
                    [k]: createMemoizer(v, options),
                };
            }
        }
    });
