import {Formatter} from "../Formatter";
import {IOutputOptions, Output, OutputVerbosity} from "./Output";
import {WriteStreamOutput} from "./WriteStreamOutput";

export class StdioOutput extends WriteStreamOutput {
    protected errorOutput: Output;

    constructor(options: Partial<IOutputOptions> = {}) {
        super(process.stdout, options);

        const actualDecorated = this.isDecorated();

        this.errorOutput = new WriteStreamOutput(process.stderr, {
            ...options,
            formatter: this.getFormatter(),
        });

        if (undefined !== options.decorated) {
            this.setDecorated(actualDecorated && this.errorOutput.isDecorated());
        }
    }

    public getErrorOutput() {
        return this.errorOutput;
    }

    public setDecorated(decorated: boolean) {
        super.setDecorated(decorated);

        if (this.errorOutput) {
            this.errorOutput.setDecorated(decorated);
        }

        return this;
    }

    public setFormatter(formatter: Formatter) {
        super.setFormatter(formatter);
        this.errorOutput.setFormatter(formatter);

        return this;
    }

    public setVerbosity(level: OutputVerbosity) {
        super.setVerbosity(level);

        this.errorOutput.setVerbosity(level);

        return this;
    }
}
