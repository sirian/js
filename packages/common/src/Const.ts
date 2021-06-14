import {Func} from "@sirian/ts-extra-types";

export const noop: Func<void> = () => {};
export const asIs = <T>(v: T) => v;
