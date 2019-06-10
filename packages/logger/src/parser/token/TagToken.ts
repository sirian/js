import {BaseToken} from "./BaseToken";

export class TagToken extends BaseToken {
    public readonly tag: string;
    public readonly closing: boolean;

    constructor(tag: string, closing: boolean = false, text: string) {
        super(text);
        this.tag = tag;
        this.closing = closing;
    }
}
