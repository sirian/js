import {Reader} from "./Reader";
import {Token} from "./token";
import {EscapeTokenizer, MacroTokenizer, PlaceholderTokenizer, TagTokenizer, Tokenizer} from "./tokenizer";

export class Parser {
    protected tokenizers: Tokenizer[];

    constructor() {
        this.tokenizers = [
            new EscapeTokenizer(),
            new TagTokenizer(),
            new MacroTokenizer(),
            new PlaceholderTokenizer(),
        ];
    }

    public parse(line: string): Token[] {
        const reader = new Reader(line);

        while (true) {
            const position = reader.index;

            this.tokenize(reader);

            if (reader.index <= position || reader.isEOF()) {
                break;
            }
        }

        return reader.getTokens();
    }

    protected tokenize(reader: Reader) {
        let closestIndex = reader.remainingLength;

        for (const tokenizer of this.tokenizers) {
            const match = tokenizer.match(reader);

            if (!match) {
                continue;
            }

            const index = match.index;

            if (0 === index) {
                tokenizer.handle(match, reader);
                return;
            }

            if (index > 0 && index < closestIndex) {
                closestIndex = index;
            }
        }

        const text = reader.peekSubstring(closestIndex);

        reader.pushToken(text);
    }
}
