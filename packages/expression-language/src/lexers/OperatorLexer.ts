import {Rgx} from "@sirian/common";
import {AbstractRegExpLexer, Reader, Token} from "@sirian/parser";
import {Operators} from "../Operators";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export class OperatorLexer extends AbstractRegExpLexer<TokenTypes> {
    protected regexp: RegExp;

    constructor(operators: Operators = Operators.default) {
        super();

        const pattern = operators
            .getOperatorNames()
            .sort((a, b) => a.length - b.length)
            .map(Rgx.escape)
            .map((o) => /[a-z]$/i.test(o) ? o + "(?=[\\s(])" : o)
            .join("|");

        this.regexp = new RegExp("^(?:" + pattern + ")");
    }

    public handleMatch(match: RegExpMatchArray, reader: Reader, tokenStream: TokenStream) {
        const text = match[0];
        tokenStream.push(new Token(TokenType.OPERATOR, text, reader.position));
        reader.moveForward(text.length);
    }
}
