import {Reader} from "../Reader";
import {Tokenizer, TokenizerMatch} from "./Tokenizer";

export class EscapeTokenizer extends Tokenizer {
    public handle(match: TokenizerMatch, reader: Reader) {
        const text = reader.peekSubstring(2);
        reader.pushToken(text);
    }

    public match(reader: Reader) {
        const pos = reader.indexOf("\\");
        if (pos !== -1) {
            return {index: pos};
        }
    }
}
