import {AbstractQuestion} from "./AbstractQuestion";

export class Question extends AbstractQuestion<string> {
    public normalize(value: string) {
        return value;
    }

    public getDefaultOptions() {
        return {};
    }
}
