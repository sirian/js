import {Var} from "@sirian/common";
import {callableClass} from "@sirian/decorators";

export interface DumpOptions {
    snapshot?: boolean;

    [id: string]: any;
}

export interface ObjectDumpOptions extends DumpOptions {

}

export interface JSONDumpOptions extends DumpOptions {
    indent?: string | number;
    replacer?: (number | string)[];
}

export interface SprintfDumpOptions extends DumpOptions {
    format?: string;
    maxLen?: number;
}

export interface NumberDumpOptions extends SprintfDumpOptions {

}

export interface StringDumpOptions extends SprintfDumpOptions {

}

export interface ArrayDumpOptions extends DumpOptions {

}

export interface FunctionDumpOptions extends ObjectDumpOptions {

}

export type TypedDumpOptions<T> =
    T extends "number" ? NumberDumpOptions :
    T extends "string" ? StringDumpOptions :
    T extends "json" ? JSONDumpOptions :
    T extends "var" ? DumpOptions :
    T extends string ? DumpOptions :
    never;

export const Dump = callableClass("var", class Dump<T extends string> {
    public target: any;
    public options: TypedDumpOptions<T>;
    public type: T;

    constructor(target: any, type: T, options: TypedDumpOptions<T>) {
        this.target = target;
        this.type = type;
        this.options = options;
    }

    public static var(target: any, options?: DumpOptions): Dump<any>;
    public static var<T extends string>(target: any, type: T, options?: TypedDumpOptions<T>): Dump<T>;
    public static var(target: any, type: any = "var", options: DumpOptions = {}) {
        if (Var.isObject(type)) {
            options = type;
            type = "var";
        }
        return new Dump(target, type, options);
    }

    public static function(target: any, options: FunctionDumpOptions) {
        return Dump.var(target, "function", options);
    }

    public static json(target: any, options: JSONDumpOptions) {
        return Dump.var(target, "json", options);
    }

    public static number(target: any, options: NumberDumpOptions) {
        return Dump.var(target, "number", options);
    }

    public static string(target: any, options: StringDumpOptions) {
        return Dump.var(target, "string", options);
    }
});
