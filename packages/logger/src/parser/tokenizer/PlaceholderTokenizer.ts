import {Reader} from "../Reader";
import {PlaceholderToken} from "../token";
import {RegExpTokenizer, RegExpTokenizerMatch} from "./RegExpTokenizer";

export class PlaceholderTokenizer extends RegExpTokenizer {
    constructor() {
        const pattern = /%(?:\(([^)]+)\))?([^A-Za-z]*)?([A-Za-z])/;
        super(pattern);
    }

    public handle(match: RegExpTokenizerMatch, reader: Reader) {
        const [text, path, options, type] = match;

        reader.moveForward(text.length);

        if ("%%" === text) {
            reader.pushToken("%");
            return;
        }

        const token = new PlaceholderToken(path, type, options, text);
        reader.pushToken(token);
    }
}
