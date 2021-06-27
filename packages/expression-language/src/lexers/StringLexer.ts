import {AbstractRegExpLexer, Reader, Token} from "@sirian/parser";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class StringLexer extends AbstractRegExpLexer<TokenTypes> {
    protected regexp = /^(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*))'/s;

    protected handleMatch(match: RegExpMatchArray, reader: Reader, stream: TokenStream) {
        const text = match[0];
        const value = text.slice(1, -1);
        stream.push(new Token(TokenType.STRING, value, reader.position));
        reader.moveForward(text.length);
    }

}
