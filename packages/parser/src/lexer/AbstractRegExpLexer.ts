import {Reader} from "../Reader";
import {TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";
import {ILexer} from "./ILexer";

export abstract class AbstractRegExpLexer<T extends TokenTypes = TokenTypes> implements ILexer<T> {
    protected abstract get regexp(): RegExp;

    public handle(reader: Reader, tokenStream: TokenStream<T>) {
        const match = reader.match(this.regexp);

        if (!match) {
            return false;
        }

        return false !== this.handleMatch(match, reader, tokenStream);
    }

    protected abstract handleMatch(match: RegExpMatchArray, reader: Reader, stream: TokenStream<T>): boolean | void;
}
