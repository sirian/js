import {Arr, Obj, Var} from "@sirian/common";
import {HttpHeader, HttpHeaderPredicateCallback, HttpHeaderValue, IHttpHeader} from "./HttpHeader";

export type HttpHeaderBagInit = IHttpHeader[] | HttpHeaderBag | Record<string, HttpHeaderValue> | string;

export class HttpHeaderBag {
    protected headers: HttpHeader[] = [];

    constructor(headers?: HttpHeaderBagInit) {
        this.addHeaders(headers);
    }

    get length() {
        return this.headers.length;
    }

    public static create(headers?: HttpHeaderBagInit) {
        return new HttpHeaderBag(headers);
    }

    public static fromString(rawHeaders: string) {
        const headers = this.create();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2

        const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        const lines = preProcessedHeaders.trim().split(/\r?\n/);

        for (const line of lines) {
            const parts = line.split(":");
            const key = parts.shift()!.trim();
            if (key) {
                headers.add(key, parts.join(":").trim());
            }
        }

        return headers;
    }

    public isEqual(bag: HttpHeaderBag) {
        const length = this.length;

        if (length !== bag.length) {
            return false;
        }

        const copy = bag.all();

        for (let i = 0; i < length; i++) {
            const h1 = this.headers[i];

            const index = copy.findIndex((h2) => h1.isEqual(h2));
            if (-1 === index) {
                return false;
            }

            copy.splice(index, 1);
        }

        return true;
    }

    public addHeaders(values?: HttpHeaderBagInit) {
        if (!values) {
            return;
        }

        if (Var.isString(values)) {
            const headers = HttpHeaderBag.fromString(values);
            this.addHeaders(headers);
            return this;
        }

        if (Var.isInstanceOf(values, HttpHeaderBag)) {
            this.addHeaders(values.headers);
            return this;
        }

        if (Var.isArray(values)) {
            for (const header of values) {
                this.add(header.name, header.value);
            }

            return this;
        }

        if (Var.isObject(values)) {
            for (const [key, value] of Obj.entries(values)) {
                this.add(key, value);
            }
        }

        return this;
    }

    public all() {
        return this.headers.slice();
    }

    public has(name: string) {
        return this.headers.some((header) => header.isEqualName(name));
    }

    public addHeader(header: HttpHeader) {
        this.headers.push(header);

        return this;
    }

    public getHeadersByName(name: string) {
        return this.headers.filter((header) => header.isEqualName(name));
    }

    public getHeaderByName(name: string) {
        const headers = this.getHeadersByName(name);

        if (headers) {
            return headers[headers.length - 1];
        }
    }

    public getValues(name: string) {
        const headers = this.getHeadersByName(name);

        if (!headers) {
            return;
        }

        return headers.map((header) => header.value);
    }

    public get(name: string, defaultValue?: any) {
        if (!this.has(name)) {
            return defaultValue;
        }

        return this.getHeaderByName(name)!.value;
    }

    public remove(predicate: string | RegExp | HttpHeaderPredicateCallback) {
        Arr.remove(this.headers, (header) => header.test(predicate));

        return this;
    }

    public set(name: string, value: HttpHeaderValue) {
        this.remove(name);
        this.add(name, value);
        return this;
    }

    public add(name: string, value: HttpHeaderValue = "") {
        const header = this.createHeader(name, value);

        this.addHeader(header);

        return this;
    }

    public clear() {
        this.headers = [];

        return this;
    }

    public filter(predicate: string | RegExp | HttpHeaderPredicateCallback) {
        return this.headers.filter((header) => header.test(predicate));
    }

    public toString() {
        return this
            .headers
            .sort((h1, h2) => h1.normalName.localeCompare(h2.normalName))
            .map((h) => h + "\r\n").join("");
    }

    protected createHeader(name: string, value?: HttpHeaderValue) {
        return new HttpHeader(name, value);
    }
}
