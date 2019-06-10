import {Token, TokenStream} from "./token";

export class Reader {
    protected source: string;
    protected cursor: number;
    protected tokens: Token[];

    constructor(source: string) {
        this.source = source;
        this.cursor = 0;
        this.tokens = [];
    }

    get length() {
        return this.source.length;
    }

    get remainingLength() {
        return this.length - this.cursor;
    }

    get index() {
        return this.cursor;
    }

    public current() {
        return this.source[this.index];
    }

    public isEOF() {
        return this.cursor >= this.length;
    }

    public moveForward(length: number) {
        this.cursor += length;
    }

    public moveToEnd() {
        this.cursor = this.length;
    }

    public indexOf(substring: string) {
        return this.source.indexOf(substring, this.cursor);
    }

    public match(pattern: RegExp) {
        return this.rest().match(pattern);
    }

    public rest(length?: number) {
        return this.source.substr(this.cursor, length);
    }

    public peekSubstring(length: number) {
        const value = this.rest(length);
        this.moveForward(length);
        return value;
    }

    public pushToken(...tokens: TokenStream) {
        this.tokens.push(...tokens);
        return this;
    }

    public getTokens() {
        return this.tokens;
    }
}
