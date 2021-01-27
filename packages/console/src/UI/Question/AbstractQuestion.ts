import {stringifyVar} from "@sirian/common";

export interface IQuestionOptions<V> {
    question: string;
    defaultValue?: V;
    hidden: boolean;
    hiddenFallback: boolean;
    attempts: number;
    prompt: string;
    autocomplete?: string[];
}

export abstract class AbstractQuestion<V, TOptions extends IQuestionOptions<V> = any> {
    protected options: TOptions;

    constructor(arg: Partial<TOptions> = {}) {
        const options = {
            attempts: Number.MAX_SAFE_INTEGER,
            hidden: false,
            hiddenFallback: true,
            prompt: "",
            question: "",
        };

        this.options = {
            ...options,
            ...this.getDefaultOptions(),
            ...arg,
        };
    }

    public getPrompt() {
        return this.options.prompt;
    }

    public isHidden() {
        return this.options.hidden;
    }

    public getQuestion() {
        return this.options.question;
    }

    public getDefault() {
        return this.options.defaultValue;
    }

    public getCompletions(text: string): string[] {
        const values = this.options.autocomplete;

        if (!values) {
            return [];
        }

        const set = new Set<string>();
        for (const value of values) {
            const str = stringifyVar(value);
            if (str.startsWith(text)) {
                set.add(str);
            }
        }

        return [...set];
    }

    public abstract normalize(value: string): V;

    public getMaxAttempts() {
        return this.options.attempts;
    }

    public getSynopsis(): string {
        const defaultValue = this.getDefault();
        const text = this.getQuestion();

        if (undefined === defaultValue) {
            return ` <info>${text}</info>:`;
        }

        return ` <info>${text}</info> [<comment>${defaultValue}</comment>]:`;
    }

    protected abstract getDefaultOptions(): TOptions & Partial<IQuestionOptions<V>>;
}
