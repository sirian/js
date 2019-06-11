import {AbstractRegExpLexer, Reader, Token} from "@sirian/parser";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class NameLexer extends AbstractRegExpLexer<TokenTypes> {
    protected regexp = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

    protected handleMatch(match: RegExpMatchArray, reader: Reader, stream: TokenStream) {
        const text = match[0];
        stream.push(new Token(TokenType.NAME, text, reader.position));
        reader.moveForward(text.length);
    }
}
