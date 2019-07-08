import {sprintf, Str, Var} from "@sirian/common";
import {LogicError} from "../Error";
import {Output, OutputVerbosity} from "../Output";
import {ESC} from "../TTY";
import {Perf, StrUtil, Units} from "../Util";

export type ProgressBarPlaceholderFormatter = (bar: ProgressBar) => string | number;

export class ProgressBar {
    public static readonly formats: Record<string, string> = {
        debug: " %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%",
        default: " %current%/%max% [%bar%] %percent:3s%%",
        verbose: " %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%",
        very_verbose: " %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s%",
    };
    public static readonly nomaxFormats: Record<string, string> = {
        debug: " %current% [%bar%] %elapsed:6s% %memory:6s%",
        default: " %current% [%bar%]",
        verbose: " %current% [%bar%] %elapsed:6s%",
        very_verbose: " %current% [%bar%] %elapsed:6s%",
    };

    protected static placeholderFormatters: Record<string, ProgressBarPlaceholderFormatter> = {
        bar: (bar) => {
            const barWidth = bar.getBarWidth();
            const completeBars = Math.trunc(
                bar.getMaxSteps() > 0 ? bar.getProgressPercent() * barWidth : bar.getProgress() % barWidth,
            );

            let display = bar.getBarCharacter().repeat(completeBars);

            if (completeBars < barWidth) {
                const formatter = bar.getOutput().getFormatter();
                const progressChar = bar.getProgressCharacter();
                const emptyBars = barWidth - completeBars - formatter.widthWithoutDecoration(progressChar);
                const emptyBarChar = bar.getEmptyBarCharacter();
                display += progressChar + emptyBarChar.repeat(emptyBars);
            }

            return display;
        },
        current: (bar) => Str.padLeft(bar.getProgress(), bar.getStepWidth()),
        elapsed: (bar) => bar.formatTime((Perf.now() - bar.getStartTime()) / 1000),
        max: (bar) => bar.getMaxSteps(),
        memory: (bar) => Units.formatBytes(process.memoryUsage().heapUsed),

        percent: (bar) => Math.trunc(bar.getProgressPercent() * 100),

        remaining: (bar) => {
            if (!bar.getMaxSteps()) {
                throw new LogicError("Unable to display the remaining time if the maximum number of steps is not set.");
            }
            let remaining = 0;
            if (bar.getProgress()) {
                remaining = Math.round(
                    ((Perf.now() - bar.startTime) / 1000 / bar.getProgress()) * (bar.getMaxSteps() - bar.getProgress()),
                );
            }

            return bar.formatTime(remaining);
        },

        estimated: (bar) => {
            if (!bar.getMaxSteps()) {
                throw new LogicError("Unable to display the estimated time if the maximum number of steps is not set.");
            }

            let estimated = 0;
            if (bar.getProgress()) {
                estimated = Math.round(((Perf.now() - bar.startTime) / 1000 / bar.getProgress()) * bar.getMaxSteps());
            }

            return bar.formatTime(estimated);
        },
    };

    protected barWidth: number = 28;
    protected barChar?: string;
    protected emptyBarChar: string = "-";
    protected progressChar: string = ">";
    protected format?: string;
    protected internalFormat?: string;
    protected redrawFreq: number = 1;
    protected output: Output;
    protected step: number = 0;
    protected max: number = 0;
    protected startTime: number;
    protected stepWidth!: number;
    protected percent: number = 0.0;
    protected formatLineCount: number = 0;
    protected messages: Map<string, string> = new Map();
    protected overwrite = true;
    protected firstRun: boolean = false;

    public constructor(output: Output, max: number = 0) {
        this.output = output;
        this.setMaxSteps(max);

        if (!this.output.isDecorated()) {
            // disable overwrite when output does not support ANSI codes.
            this.overwrite = false;

            // set a reasonable redraw frequency so output isn't flooded
            this.setRedrawFrequency(max / 10);
        }

        this.startTime = Perf.now();
    }

    public formatTime(secs: number) {
        const formats = [
            [0, "< 1 sec"],
            [1, "1 sec"],
            [2, "secs", 1],
            [60, "1 min"],
            [120, "mins", 60],
            [3600, "1 hr"],
            [7200, "hrs", 3600],
            [86400, "1 day"],
            [172800, "days", 86400],
        ];

        for (let index = 0; index < formats.length; index++) {
            const [breakpoint, text, divider] = formats[index] as [number, string, number | undefined];

            if (secs >= breakpoint) {
                if ((index + 1 < formats.length && secs < formats[index + 1][0]) || index === formats.length - 1) {
                    if (!divider) {
                        return text;
                    }

                    return sprintf("%d %s", Math.trunc(secs / divider), text);
                }
            }
        }

        return "";
    }

    public getOutput() {
        return this.output;
    }

    public getStartTime() {
        return this.startTime;
    }

    public getStepWidth() {
        return this.stepWidth;
    }

    public setMessage(message: string, name = "message") {
        this.messages.set(name, message);
    }

    public getMessage(name: string = "message") {
        return this.messages.get(name);
    }

    public getMaxSteps() {
        return this.max;
    }

    public getProgress() {
        return this.step;
    }

    public getProgressPercent() {
        return this.percent;
    }

    public setBarWidth(size: number) {
        this.barWidth = Math.max(1, size);
    }

    public getBarWidth() {
        return this.barWidth;
    }

    public setBarCharacter(char: string) {
        this.barChar = char;
    }

    public getBarCharacter() {
        if (!this.barChar) {
            return this.max ? "=" : this.emptyBarChar;
        }

        return this.barChar;
    }

    public setEmptyBarCharacter(char: string) {
        this.emptyBarChar = char;
    }

    public getEmptyBarCharacter() {
        return this.emptyBarChar;
    }

    public setProgressCharacter(char: string) {
        this.progressChar = char;
    }

    public getProgressCharacter() {
        return this.progressChar;
    }

    public setFormat(format: string) {
        this.format = undefined;
        this.internalFormat = format;
    }

    public setRedrawFrequency(freq: number) {
        this.redrawFreq = Math.max(freq, 1);
    }

    public start(max?: number) {
        this.startTime = Perf.now();
        this.step = 0;
        this.percent = 0.0;

        if (max) {
            this.setMaxSteps(max);
        }

        this.display();
    }

    public advance(step: number = 1) {
        this.setProgress(this.step + step);
        return this;
    }

    public setOverwrite(overwrite: boolean) {
        this.overwrite = overwrite;
    }

    public setProgress(step: number) {
        if (this.max && step > this.max) {
            this.max = step;
        } else if (step < 0) {
            step = 0;
        }

        const prevPeriod = Math.trunc(this.step / this.redrawFreq);
        const currPeriod = Math.trunc(step / this.redrawFreq);

        this.step = step;
        this.percent = this.max ? this.step / this.max : 0;

        if (prevPeriod !== currPeriod || this.max === step) {
            this.display();
        }
    }

    public finish() {
        if (!this.max) {
            this.max = this.step;
        }

        if (this.step === this.max && !this.overwrite) {
            // prevent double 100% output
            return;
        }
        this.setProgress(this.max);
    }

    public display() {
        if (this.output.isQuiet()) {
            return;
        }

        if (!this.format) {
            this.setRealFormat(this.internalFormat || this.determineBestFormat());
        }

        this.doOverwrite(this.buildLine());
    }

    public clear() {
        if (!this.overwrite) {
            return;
        }

        if (!this.format) {
            this.setRealFormat(this.internalFormat || this.determineBestFormat());
        }

        return this.doOverwrite("");
    }

    protected buildLine() {
        return this.format!.replace(/%([a-z\-_]+)(?:\:([^%]+))?%/gi, (...matches: string[]) => {
            const formatter = ProgressBar.placeholderFormatters[matches[1]];
            let text;

            const messages = this.messages;

            if (formatter) {
                text = formatter(this);
            } else if (messages.has(matches[1])) {
                text = messages.get(matches[1])!;
            } else {
                return matches[0];
            }

            if (matches[2]) {
                text = sprintf("%" + matches[2], text);
            }

            return Var.stringify(text);
        });
    }

    protected setRealFormat(format: string) {
        // try to use the _nomax variant if available

        this.format = (!this.max && ProgressBar.nomaxFormats[format]) || ProgressBar.formats[format] || format;

        this.formatLineCount = Str.substringCount(this.format, "\n");
    }

    protected setMaxSteps(max: number) {
        this.format = undefined;
        this.max = Math.max(0, max);
        this.stepWidth = this.max ? StrUtil.width(Var.stringify(this.max)) : 4;
    }

    protected doOverwrite(message: string) {
        if (this.overwrite) {
            if (!this.firstRun) {
                const messages = [ESC.cr(), ESC.eraseLine()];

                for (let i = 0; i < this.formatLineCount; i++) {
                    messages.push(ESC.up(), ESC.eraseLine());
                }

                this.output.write(messages);
            }
        } else if (this.step > 0) {
            this.output.newLine();
        }

        this.firstRun = false;

        this.output.write(message);
    }

    protected determineBestFormat() {
        const verbosityFormats: { [P in OutputVerbosity]?: string } = {
            [OutputVerbosity.VERBOSE]: "verbose",
            [OutputVerbosity.VERY_VERBOSE]: "very_verbose",
            [OutputVerbosity.DEBUG]: "debug",
        };

        const verbosity = this.output.getVerbosity();
        const format = verbosityFormats[verbosity] || "default";

        if (!this.max) {
            return ProgressBar.nomaxFormats[format];
        }

        return ProgressBar.formats[format];
    }
}
