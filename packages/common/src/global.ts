const fn = () => 0;

export const global = fn.constructor("return this")() as Global;

export interface Global {
    Boolean: typeof Boolean;
    Function: typeof Function;
    Number: typeof Number;
    Object: typeof Object;
    String: typeof String;
    Symbol: typeof Symbol;

    Math: typeof Math;
    Date: typeof Date;
    Reflect: typeof Reflect;
    JSON: typeof JSON;

    ArrayBuffer: typeof ArrayBuffer;
    Int8Array: typeof Int8Array;
    Int16Array: typeof Int16Array;
    Int32Array: typeof Int32Array;
    Uint8Array: typeof Uint8Array;
    Uint8ClampedArray: typeof Uint8ClampedArray;
    Uint16Array: typeof Uint16Array;
    Uint32Array: typeof Uint32Array;
    Float32Array: typeof Float32Array;
    Float64Array: typeof Float64Array;
}
