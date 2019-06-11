import {TokenTypes} from "./Token";
import {TokenStream} from "./TokenStream";

export abstract class AbstractTokenizer<T extends TokenTypes> {
    public abstract tokenize(source: string): TokenStream<T>;
}
