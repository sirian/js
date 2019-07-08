import {ArgvInput} from "./ArgvInput";

export class StringInput extends ArgvInput {
    protected pos!: number;
    protected input!: string;

    constructor(input: string) {
        super([]);

        this.setTokens(this.allTokens(input));
    }

    protected nextToken() {
        let state = 0;
        let token;
        let strch;
        let escape = false;
        let saveEscape = false;
        const input = this.input;

        const whitespaces = [" ", "\r", "\t", "\n"];

        while (this.pos < input.length) {
            const ch = input[this.pos];
            saveEscape = escape;

            switch (state) {
                // eat up whitespace between tokens
                case 0:
                    if (!whitespaces.includes(ch)) {
                        state = 1;
                        token = "";
                        continue;
                    }
                    break;

                case 1:
                    if (ch === `"` || ch === `'`) {
                        // check for start of string
                        if (escape) {
                            token += ch;
                        } else {
                            state = 2;
                            strch = ch;
                        }
                    } else if (!escape && whitespaces.includes(ch)) {
                        // end of token?
                        this.pos++;
                        return token;
                    } else {
                        if (!escape && ch === `\\`) {
                            escape = true;
                        } else {
                            token += ch;
                        }
                    }
                    break;

                // string handling
                case 2:
                    if (ch === strch) {
                        if (escape && ch === `"`) {
                            token += ch;
                        } else {
                            state = 1;
                        }
                    } else {
                        if (!escape && ch === `\\` && strch === `"`) {
                            escape = true;
                        } else {
                            token += ch;
                        }
                    }
                    break;
            }

            escape = saveEscape !== escape;
            this.pos++;
        }

        return token;
    }

    protected allTokens(input: string) {
        this.input = input;
        this.pos = 0;

        const tokens = [];
        while (true) {
            const token = this.nextToken();

            if (undefined === token) {
                break;
            }

            tokens.push(token);
        }
        return tokens;
    }
}
