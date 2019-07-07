import {Numbers} from "./number";
import {AnyFunc} from "./types";

export type Cast<T, P, D extends P = P> = T extends P ? T : D;
export type CastFunc<T> = T extends AnyFunc ? T : never;

export type ArraySymbols = {
    [Symbol.iterator]: any;
    [Symbol.unscopables]: any;
};

export type KeyToNumber<K extends keyof any> =
    K extends number | symbol ? K :
    K extends keyof Numbers ? Numbers[K] :
    never; // number & ERROR<["StringToNumber fails", S]>;

export type KeyToString<K extends keyof any> =
    K extends string | symbol ? K :
    { [P in keyof Numbers]: K extends Numbers[P] ? P : never }[keyof Numbers];
