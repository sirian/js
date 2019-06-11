import {ILexer, Reader, Token} from "@sirian/parser";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class PunctuationLexer implements ILexer<TokenTypes> {
    public handle(reader: Reader, stream: TokenStream) {
        const c = reader.current;

        if (-1 === ".,?:".indexOf(c)) {
            return false;
        }

        stream.push(new Token(TokenType.PUNCTUATION, c, reader.position));
        reader.moveForward();
        return true;
    }

}
