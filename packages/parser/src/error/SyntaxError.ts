import {ParserError} from "./ParserError";

export class SyntaxError extends ParserError {
    constructor(message: string, cursor = 0, expression = "", subject?: string, proposals?: string[]) {
        message = `${message} around position ${cursor}`;
        if (expression) {
            message = `${message} for expression \`{expression}\``;
        }
        message += ".";

        // if (subject && proposals) {
        //     let minScore = INF;
        //     let guess;
        //     for (const proposal of proposals) {
        //         const distance = levenshtein(subject, proposal);
        //         if (distance < minScore) {
        //             guess = proposal;
        //             minScore = distance;
        //         }
        //     }
        //
        //     if (guess && minScore < 3) {
        //         message += ` Did you mean "${guess}"?`;
        //     }
        // }

        super(message);
    }
}
