import {TokenTypes} from "../Token";
import {TokenStream} from "../TokenStream";

export abstract class AbstractParser<R, T extends TokenTypes = TokenTypes> {
    public abstract parse(stream: TokenStream<T>): R;
}
