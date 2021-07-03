import {hasOwn, sprintf} from "@sirian/common";
import {InvalidArgumentError} from "../Error";
import {TTYStyle, TTYStyles, VTS} from "../TTY";

export class FormatterStyle {
    protected options: Set<TTYStyle>;

    constructor(options: TTYStyle[] = []) {
        this.options = new Set();
        for (const option of options) {
            this.add(option);
        }
    }

    public static isValid(option: string): option is TTYStyle {
        return hasOwn(TTYStyles, option);
    }

    public add(option: TTYStyle) {
        if (!FormatterStyle.isValid(option)) {
            throw new InvalidArgumentError(sprintf("Invalid terminal style '%s'", option));
        }
        this.options.add(option);
    }

    public apply(text: string) {
        const setCodes: number[] = [];
        const unsetCodes: number[] = [];

        for (const option of this.options) {
            const [set, unset] = TTYStyles[option];
            setCodes.push(set);
            unsetCodes.push(unset);
        }

        if (0 === setCodes.length) {
            return text;
        }
        return new VTS()
            .style(setCodes)
            .push(text)
            .style(unsetCodes)
            .toString();
    }
}
