import {ILexer, Reader, SyntaxError, Token} from "@sirian/parser";
import {TokenType, TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

const openBrackets = "([{";
const closeBrackets = ")]}";

export class BracketLexer implements ILexer<TokenTypes> {
    protected brackets: WeakMap<Reader, Array<[string, number]>> = new WeakMap();

    public handle(reader: Reader, stream: TokenStream) {
        return this.openBracket(reader, stream) || this.closeBracket(reader, stream);
    }

    public getBrackets(reader: Reader) {
        const brackets = this.brackets;

        if (!brackets.has(reader)) {
            brackets.set(reader, []);
        }

        return brackets.get(reader)!;
    }

    public assertClosed(reader: Reader) {
        const brackets = this.getBrackets(reader);

        if (!brackets.length) {
            return;
        }

        const [expect, cur] = brackets[brackets.length - 1];

        throw new SyntaxError(`Unclosed "${expect}"`, cur, reader.source);
    }

    protected openBracket(reader: Reader, stream: TokenStream) {
        const char = reader.current;

        if (-1 === openBrackets.indexOf(char)) {
            return false;
        }

        const pos = reader.position;
        this.getBrackets(reader).push([char, pos]);
        stream.push(new Token(TokenType.PUNCTUATION, char, pos));
        reader.moveForward();
        return true;
    }

    protected closeBracket(reader: Reader, stream: TokenStream) {
        const char = reader.current;

        const bracketIndex = closeBrackets.indexOf(char);

        if (-1 === bracketIndex) {
            return false;
        }

        const pos = reader.position;

        const brackets = this.getBrackets(reader);

        if (!brackets.length) {
            throw new SyntaxError(`Unexpected "${char}"`, pos, reader.source);
        }

        const [openTag, openPos] = brackets.pop()!;

        if (openTag !== openBrackets[bracketIndex]) {
            throw new SyntaxError(`Unclosed "${char}"`, openPos, reader.source);
        }

        stream.push(new Token(TokenType.PUNCTUATION, char, pos));
        reader.moveForward();
        return true;
    }
}
