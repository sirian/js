import {isArray, Str, Var} from "@sirian/common";
import {InvalidArgumentError} from "../../Error";
import {KV, StrUtil} from "../../Util";
import {AbstractQuestion, IQuestionOptions} from "./AbstractQuestion";

export interface IChoiceQuestionOptions<T> extends IQuestionOptions<T> {
    choices: Record<string, T> | T[];
}

export class ChoiceQuestion<T> extends AbstractQuestion<T, IChoiceQuestionOptions<T>> {
    public getCompletions(text: string) {
        const options = this.options;

        if (!options.autocomplete) {
            const choices = this.getChoices();
            const autocomplete = [];

            if (!isArray(choices)) {
                const keys = KV.keys(choices);
                autocomplete.push(...keys);
            }

            const values = KV.values(choices).map(Var.stringify);
            autocomplete.push(...values);

            options.autocomplete = autocomplete;
        }

        return super.getCompletions(text);
    }

    public getChoices() {
        return this.options.choices;
    }

    public getSynopsis() {
        const messages = [super.getSynopsis()];

        const choices = this.getChoices();

        const keys: any[] = KV.keys(choices); // todo: remove any[], typescript issue at keys.map
        const widths = keys.map((key: any) => StrUtil.width(key));

        const width = Math.max(...widths);

        for (const [key, value] of KV.entries(choices)) {
            const k = Var.stringify(key);
            messages.push(`  [<comment>${Str.padLeft(k, width)}</comment>] ${value}`);
        }
        return messages.join("\n");
    }

    public getDefaultOptions() {
        return {
            choices: [],
            prompt: " > ",
        } as any;
    }

    public normalize(selected: string) {
        const choices = this.getChoices();

        const strChoice = Var.stringify(selected);

        for (const [key, choice] of KV.entries(choices)) {
            if (Var.stringify(key) === strChoice) {
                return choice;
            }
        }

        const values = new Set<T>();

        for (const choice of KV.values(choices)) {
            if (Var.stringify(choice) === strChoice) {
                values.add(choice);
            }
        }

        switch (values.size) {
            case 0:
                throw new InvalidArgumentError(`Value "${strChoice}" is invalid`);
            case 1:
                return [...values][0];
            default:
                throw new InvalidArgumentError(`Value "${strChoice}" is ambiguous`);
        }
    }
}
