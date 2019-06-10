import {Reader} from "../Reader";
import {TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";
import {ILexer, LexerCallback} from "./ILexer";

export class CallbackLexer<T extends TokenTypes = TokenTypes> implements ILexer<T> {
    protected callback: LexerCallback<T>;

    constructor(callback: LexerCallback<T>) {
        this.callback = callback;
    }

    public handle(reader: Reader, tokenStream: TokenStream<T>) {
        return this.callback(reader, tokenStream);
    }
}
