import {_String} from "./native";
import {Var} from "./Var";

export class Unicode extends _String {
    constructor(value: any) {
        super(Var.stringify(value));
    }

    public get symbols() {
        return [...this];
    }

    public get graphemes(): string[] {
        const re = /(\P{M}\p{M}*)/gu;
        return this.match(re) || [];
    }

    public static isUTF8(source: string) {
        try {
            return source === decodeURIComponent(encodeURIComponent(source));
        } catch (e) {
            return false;
        }
    }

    public static from(source: any) {
        return new Unicode(source);
    }
}
