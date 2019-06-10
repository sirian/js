import {Reader} from "../Reader";

export interface TokenizerMatch {
    index: number;
}

export abstract class Tokenizer<T extends TokenizerMatch = any> {
    public abstract match(reader: Reader): T | null | void;

    public abstract handle(match: T, reader: Reader): void;
}
