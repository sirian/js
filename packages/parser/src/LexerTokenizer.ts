import {Var} from "@sirian/common";
import {SyntaxError} from "./error";
import {CallbackLexer, ILexer, LexerCallback} from "./lexer";
import {Reader} from "./Reader";
import {TokenTypes} from "./Token";
import {TokenStream} from "./TokenStream";

export interface LexerTokenizerInit<T extends TokenTypes = TokenTypes> {
    lexers?: Array<LexerCallback<T> | ILexer<T>>;
}

export class LexerTokenizer<T extends TokenTypes = TokenTypes> {
    protected lexers: Array<ILexer<T>>;

    public constructor(init: LexerTokenizerInit<T> = {}) {
        this.lexers = [];
        this.addHandlers(init.lexers || []);
    }

    public addHandlers(lexers: Array<LexerCallback<T> | ILexer<T>>) {
        for (const lexer of lexers) {
            this.addHandler(lexer);
        }
        return this;
    }

    public setHandlers(lexers: Array<LexerCallback<T> | ILexer<T>>) {
        this.lexers = [];
        this.addHandlers(lexers);
        return this;
    }

    public addHandler(handler: LexerCallback<T> | ILexer<T>) {
        if (Var.isFunction(handler)) {
            handler = new CallbackLexer(handler);
        }

        this.lexers.push(handler);

        return this;
    }

    public tokenize(source: string) {
        const reader = new Reader(source);
        const stream = new TokenStream<T>();

        this.handle(reader, stream);
        return stream;
    }

    protected handle(reader: Reader, stream: TokenStream<T>) {
        while (!reader.isEOF()) {
            const pos = reader.position;
            const cur = reader.current;

            const lexer = this.handleNext(reader, stream);

            if (!lexer) {
                throw new SyntaxError(`Unexpected token "${cur}"`, pos, reader.source);
            }

            const newPos = reader.position;

            if (newPos <= pos) {
                const name = lexer.constructor.name;
                throw new SyntaxError(`Reader position hasn't increased by "${name}"`, pos, reader.source);
            }
        }
    }

    protected handleNext(reader: Reader, stream: TokenStream<T>) {
        for (const lexer of this.lexers) {
            if (lexer.handle(reader, stream)) {
                return lexer;
            }
        }
    }
}
