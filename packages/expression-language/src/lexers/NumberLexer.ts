import {AbstractRegExpLexer, Reader, Token} from "@sirian/parser";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class NumberLexer extends AbstractRegExpLexer<TokenTypes> {
    protected regexp = /^\d+(?:\.\d+)?/;

    protected handleMatch(match: RegExpMatchArray, reader: Reader, stream: TokenStream) {
        const text = match[0];
        stream.push(new Token(TokenType.NUMBER, +text, reader.position));
        reader.moveForward(text.length);
    }
}
