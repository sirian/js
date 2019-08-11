import {Descriptor, Ref, Var} from "@sirian/common";
import {DataPropertyDescriptor} from "@sirian/ts-extra-types";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";

export const bind = Decorator.forMethod(() => {
    return <F extends Function>(proto: object, key: PropertyKey, descriptor: DataPropertyDescriptor<F>) => {
        if (!Descriptor.isDataDescriptor(descriptor) || !Var.isFunction(descriptor.value)) {
            throw new DecorateError("Only put a @bind decorator on a method");
        }

        const fn = descriptor.value;

        const bound = new WeakMap<object, F>();

        const desc: TypedPropertyDescriptor<F> = {
            configurable: true,
            enumerable: descriptor.enumerable,
            get(this: any) {
                if (!bound.has(this)) {
                    bound.set(this, fn.bind(this));
                }
                return bound.get(this)! as F;
            },
            set(this: any, value: any) {
                Ref.define(this, key, {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value,
                });
            },
        };

        return desc;
    };
});
