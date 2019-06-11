import {ArrBuf, Str, Var} from "@sirian/common";
import {Unicode} from "@sirian/unicode";

export type HttpHeaderValue = undefined | string | number | ArrayBuffer;

export type HttpHeaderPredicateCallback = (header: HttpHeader) => boolean;

export interface IHttpHeader {
    name: string;
    value: HttpHeaderValue;
}

export class HttpHeader implements IHttpHeader {
    public readonly name: string;
    public readonly normalName: string;

    protected mixedValue!: string | ArrayBuffer;

    constructor(name: string, value: HttpHeaderValue) {
        this.name = Var.stringify(name);
        this.setValue(value);
        this.normalName = HttpHeader.normalizeName(this.name);
    }

    public get value() {
        return this.mixedValue;
    }

    public get stringValue() {
        const value = this.value;

        if (Var.isPrimitive(value)) {
            return Var.stringify(value);
        }

        const bytes = new Uint8Array(value);

        return Unicode.bytesToString(bytes);
    }

    public static normalizeValue(value?: HttpHeaderValue): string | ArrayBuffer {
        if (Var.isPrimitive(value)) {
            return Var.stringify(value);
        }

        return ArrBuf.getBuffer(value);
    }

    public static normalizeName(name: string) {
        name = Var.stringify(name).toLowerCase();

        if (!HttpHeader.isValidName(name)) {
            throw new Error(`Invalid character in header field name "${name}"`);
        }

        return name
            .split("-")
            .map((part) => part.toLocaleLowerCase())
            .map((part) => Str.upperFirst(part, true))
            .join("-");
    }

    public static isValidName(name: string) {
        return /[a-z0-9\-#$%&'*+.^_`|~]/.test(name);
    }

    public setValue(value?: HttpHeaderValue) {
        this.mixedValue = HttpHeader.normalizeValue(value);
        return this;
    }

    public isEqual(header: HttpHeader) {
        return this.isEqualName(header.name) && this.isEqualValue(header.value);
    }

    public isEqualValue(value: HttpHeaderValue) {
        if (Var.isPrimitive(this.value) || Var.isPrimitive(value)) {
            return Var.isEqual(this.value, value);
        }

        return ArrBuf.isEqual(this.value, value);
    }

    public isEqualName(name: string) {
        return this.normalName === HttpHeader.normalizeName(name);
    }

    public test(predicate: string | RegExp | HttpHeaderPredicateCallback) {
        if (Var.isRegExp(predicate)) {
            return predicate.test(this.name);
        }

        if (Var.isFunction(predicate)) {
            return predicate(this);
        }

        return this.isEqualName(predicate);
    }

    public toString() {
        return this.normalName + ": " + this.stringValue;
    }
}
