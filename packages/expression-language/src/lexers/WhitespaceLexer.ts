import {ILexer, Reader} from "@sirian/parser";
import {TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class WhitespaceLexer implements ILexer<TokenTypes> {
    public handle(reader: Reader, tokenStream: TokenStream) {
        const c = reader.current;
        const ws = ["\r", "\n", "\f", "\v", " ", "\u000b"];

        if (-1 !== ws.indexOf(c)) {
            reader.moveForward();
            return true;
        }

        return false;
    }
}
