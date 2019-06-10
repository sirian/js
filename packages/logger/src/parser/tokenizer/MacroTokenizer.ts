import {Reader} from "../Reader";
import {PlaceholderToken} from "../token";
import {RegExpTokenizer, RegExpTokenizerMatch} from "./RegExpTokenizer";

export class MacroTokenizer extends RegExpTokenizer {
    constructor() {
        const pattern = /{(\w+(?:\.\w+)*)(?:%([^a-zA-Z]*)([a-zA-Z])|\|(\w+)(?::([^}]+))?)?}/;

        super(pattern);
    }

    public handle(match: RegExpTokenizerMatch, reader: Reader) {
        const [text, path, o1, t1, t2, o2] = match;

        reader.moveForward(text.length);

        if ("{{" === text) {
            reader.pushToken("{");
            return;
        }

        const token = new PlaceholderToken(path, t1 || t2, o1 || o2, text);
        reader.pushToken(token);
    }
}
