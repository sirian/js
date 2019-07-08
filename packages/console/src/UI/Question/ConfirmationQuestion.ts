import {InvalidArgumentError} from "../../Error";
import {AbstractQuestion, IQuestionOptions} from "./AbstractQuestion";

export interface IConfirmationQuestionOptions extends IQuestionOptions<boolean> {
    trueValues: string[];
    falseValues: string[];
}

export class ConfirmationQuestion extends AbstractQuestion<boolean, IConfirmationQuestionOptions> {
    public getSynopsis() {
        const defaultValue = this.getDefault();
        const text = this.getQuestion();

        const options = this.options;

        const yes = options.trueValues[0];
        const no = options.falseValues[0];

        return ` <info>${text} (${yes}/${no})</info> [<comment>${defaultValue ? yes : no}</comment>]:`;
    }

    public normalize(value: string) {
        const options = this.options;

        const trueValues = options.trueValues;
        if (trueValues.includes(value)) {
            return true;
        }

        const falseValues = options.falseValues;
        if (falseValues.includes(value)) {
            return false;
        }

        const message = [
            `Provided value "${value}" is invalid.`,
            `Positive answers are: ${trueValues.join(`", "`)}.`,
            `Negative answers are: ${falseValues.join(`", "`)} `,
        ].join("\n");

        throw new InvalidArgumentError(message);
    }

    protected getDefaultOptions() {
        return {
            defaultValue: true,
            falseValues: ["no", "n"],
            trueValues: ["yes", "y"],
        } as any;
    }
}
