import {Reader} from "../Reader";
import {TagToken} from "../token";
import {RegExpTokenizer, RegExpTokenizerMatch} from "./RegExpTokenizer";

export class TagTokenizer extends RegExpTokenizer {
    constructor() {
        const pattern = /<\/([a-z][\d_a-z-]*)?>|<([a-z][\d_a-z-]*)>/;
        super(pattern);
    }

    public handle(match: RegExpTokenizerMatch, reader: Reader) {
        const [text, closeTag, openTag] = match;

        reader.moveForward(text.length);

        if ("<<" === text) {
            reader.pushToken("<");
            return;
        }

        const closing = !openTag;
        reader.pushToken(new TagToken(openTag || closeTag, closing, text));
    }
}
