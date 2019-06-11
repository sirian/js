import {Reader} from "../Reader";
import {TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export interface ILexer<T extends TokenTypes = TokenTypes> {
    handle(reader: Reader, tokenStream: TokenStream<T>): boolean;
}

export type LexerCallback<T extends TokenTypes> = ILexer<T>["handle"];
