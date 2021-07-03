import {entriesOf, isArray, keysOf, padLeft, stringifyVar, valuesOf} from "@sirian/common";
import {InvalidArgumentError} from "../../Error";
import {StrUtil} from "../../Util";
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
                autocomplete.push(...keysOf(choices));
            }

            const values = valuesOf(choices).map((element) => stringifyVar(element));
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

        const keys = keysOf(choices);
        const widths = keys.map((k) => StrUtil.width(k));

        const width = Math.max(...widths);

        for (const [key, value] of entriesOf(choices)) {
            messages.push(`  [<comment>${padLeft(key, width)}</comment>] ${value}`);
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

        const strChoice = stringifyVar(selected);

        for (const [key, choice] of entriesOf(choices)) {
            if (key === strChoice) {
                return choice;
            }
        }

        const values = new Set<T>();

        for (const choice of valuesOf(choices)) {
            if (stringifyVar(choice) === strChoice) {
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
