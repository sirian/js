import {isInstanceOf} from "@sirian/common";
import {Ctor, TypeGuard} from "@sirian/ts-extra-types";

export const Arg = {
    Any: (value: any): value is any => true,
    InstanceOf: <T extends Ctor>(constructor: T) => {
        const fn = (value: any) => isInstanceOf(value, constructor);
        return fn as TypeGuard<InstanceType<T>>;
    },
};
