export interface TemplateStringsLike {
    readonly length: number;
    raw?: readonly string[];

    readonly [n: number]: string;
}

export class TagString {
    public readonly strings: string[];
    public readonly raw: string[];
    public readonly values: any[];

    constructor(strings: string | TemplateStringsLike, values: Iterable<any> = []) {
        this.values = Array.from(values);
        this.strings = this.normalize(strings);

        if ("object" === typeof strings) {
            this.raw = this.normalize(strings.raw || []);
        } else {
            this.raw = this.strings;
        }
    }

    public static from(strings: string | TemplateStringsLike, values: any[] = []) {
        return new TagString(strings, values);
    }

    public static stringify(str: string | TemplateStringsLike, ...values: any[]) {
        return TagString.from(str, values).toString();
    }

    public toString() {
        const strings = this.strings;

        const result = strings.slice(0, 1);

        for (let i = 1; i < strings.length; i++) {
            const value = this.values[i - 1];
            result.push(value, strings[i]);
        }

        return result.map(String).join("");
    }

    protected normalize(strings: string | ArrayLike<string>) {
        if (null === strings) {
            return [];
        }

        if ("function" === typeof strings || "object" === typeof strings) {
            return Array.from(strings).map(String);
        }

        return [String(strings)];
    }
}
