import {isFunction} from "@sirian/common";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";
import {IMemoizerOptions, Memoizer} from "./Memoizer";

export const memoize = Decorator.forMethod((options?: IMemoizerOptions<any>) => {
    return (target, key, descriptor) => {
        for (const k of ["get", "value"] as const) {
            const v = descriptor[k];
            if (isFunction(v)) {
                return {
                    ...descriptor,
                    [k]: Memoizer.memoize(v, options),
                };
            }
        }

        throw new DecorateError("Only put a @memoize decorator on a method or get accessor.");
    };
});
