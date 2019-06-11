function ctor(t: any): any {
    return t.constructor;
}

function resolveError(code: string) {
    try {
        const fn = new _Function(code);
        fn();
    } catch (e) {
        return ctor(e);
    }
}

const asyncFunction = async () => 0;

// tslint:disable:variable-name

export const _Object = ctor({}) as typeof Object;
export const _Function = ctor(ctor) as typeof Function;
export const _RegExp = ctor(/./) as typeof RegExp;
export const _Array = ctor([]) as typeof Array;
export const _String = ctor("") as typeof String;
export const _Number = ctor(0) as typeof Number;
export const _SyntaxError = resolveError("{") as typeof SyntaxError;
export const _TypeError = resolveError("null.x") as typeof TypeError;
export const _Promise = ctor(asyncFunction()) as typeof Promise;
export const _Error = _Object.getPrototypeOf(_SyntaxError) as typeof Error;
export const _NaN = 0 / 0;
export const _Infinity = 1 / 0;
export const _Symbol = Symbol;
