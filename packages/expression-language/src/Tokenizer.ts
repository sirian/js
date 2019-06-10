import {LexerTokenizer, Reader, Token} from "@sirian/parser";
import {
    BracketLexer,
    NameLexer,
    NumberLexer,
    OperatorLexer,
    PunctuationLexer,
    StringLexer,
    WhitespaceLexer,
} from "./lexers";
import {TokenType, TokenTypes} from "./Token";
import {TokenStream} from "./TokenStream";

export class Tokenizer extends LexerTokenizer<TokenTypes> {
    protected bracketLexer: BracketLexer;

    constructor() {
        super();

        this.bracketLexer = new BracketLexer();

        this.setHandlers([
            new WhitespaceLexer(),
            new NumberLexer(),
            this.bracketLexer,
            new StringLexer(),
            new OperatorLexer(),
            new PunctuationLexer(),
            new NameLexer(),
        ]);
    }

    protected handle(reader: Reader, stream: TokenStream) {
        super.handle(reader, stream);

        stream.push(new Token(TokenType.EOF, void 0, reader.position));
        this.bracketLexer.assertClosed(reader);

        return stream;
    }

    protected handleNext(reader: Reader, stream: TokenStream) {
        return super.handleNext(reader, stream);
    }
}
