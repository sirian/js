export type Token = string | BaseToken;
export type TokenStream = Token[];

export class BaseToken {
    public readonly text: string;

    constructor(text: string) {
        this.text = text;
    }

    public toString() {
        return this.text;
    }
}
