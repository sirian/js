import {ConsoleError} from "./ConsoleError";

export class CommandNotFoundError extends ConsoleError {
    public readonly alternatives: string[];

    constructor(message: string, alternatives: string[] = []) {
        super();
        this.message = message;
        this.alternatives = alternatives;
    }
}
