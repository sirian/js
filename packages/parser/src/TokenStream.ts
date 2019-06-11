import {SyntaxError} from "./error";
import {Token, TokenTypes} from "./Token";

export class TokenStream<T extends TokenTypes = TokenTypes> {
    public readonly source: string;
    protected tokens: Array<Token<T>> = [];
    protected pos: number = 0;

    constructor(tokens: Array<Token<T>> = [], source: string = "") {
        this.source = source;
        this.push(...tokens);
    }

    public get length() {
        return this.tokens.length;
    }

    public get current() {
        return this.tokens[this.pos];
    }

    public get position() {
        return this.pos;
    }

    public getTokens() {
        return [...this.tokens];
    }

    public next() {
        if (this.isEOF()) {
            throw new SyntaxError("Unexpected end of expression", this.current.position);
        }

        ++this.pos;
    }

    public push<K extends keyof T>(...tokens: Array<Token<T, K>>) {
        this.tokens.push(...tokens);
        return this;
    }

    public isEOF() {
        return this.pos >= this.tokens.length;
    }

    public expect<K extends keyof T>(type: K, value?: T[K], message?: string) {
        const token = this.current;
        if (!token.test(type, value)) {
            const error = [
                message ? message + ". " : "",
                `Unexpected token "${type}" of value "${value}" ("${type}" expected`,
                value ? ` with value "${value}"` : "",
                ")",
            ].join("");
            throw new SyntaxError(error, token.position, this.source);
        }
        this.next();
    }
}
