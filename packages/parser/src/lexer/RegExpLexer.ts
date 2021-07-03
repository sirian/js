import {Reader} from "../Reader";
import {Token, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";
import {AbstractRegExpLexer} from "./AbstractRegExpLexer";


export class RegExpLexer<T extends TokenTypes = TokenTypes, K extends keyof T = keyof T> extends AbstractRegExpLexer<T> {
    protected regexp: RegExp;
    protected type: K;

    constructor(pattern: RegExp | string, type: K) {
        super();
        this.type = type;
        this.regexp = new RegExp(pattern);
    }

    protected handleMatch(match: RegExpMatchArray, reader: Reader, stream: TokenStream<T>) {
        const text = match[0];
        const token = new Token(this.type, text as T[K], reader.position);
        stream.push(token);
        reader.moveForward(text.length);
        return true;
    }
}
