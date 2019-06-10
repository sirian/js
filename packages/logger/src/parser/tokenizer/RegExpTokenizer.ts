import {Reader} from "../Reader";
import {Tokenizer} from "./Tokenizer";

export type RegExpTokenizerMatch = RegExpMatchArray & { index: number };

export abstract class RegExpTokenizer extends Tokenizer<RegExpTokenizerMatch> {
    protected regexp: RegExp;

    constructor(pattern: RegExp | string) {
        super();
        this.regexp = new RegExp(pattern);
    }

    public match(reader: Reader) {
        return reader.match(this.regexp) as RegExpTokenizerMatch;
    }
}
