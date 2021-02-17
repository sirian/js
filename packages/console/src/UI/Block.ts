import {castArray, padRight, stringifyVar} from "@sirian/common";
import {Formatter, FormatterStyleDefinition} from "../Formatter";
import {Output} from "../Output";
import {StrUtil} from "../Util";

export type BlockPadding = number[];

export interface IBlockOptions {
    type: string;
    style?: FormatterStyleDefinition;
    padding: BlockPadding;
    maxWidth: number;
    minWidth: number;
}

export class Block {
    protected options: IBlockOptions;
    protected output: Output;

    constructor(output: Output, options: Partial<IBlockOptions> = {}) {
        this.output = output;
        this.options = {
            maxWidth: 120,
            minWidth: 0,
            padding: [1, 2],
            type: "",
            ...options,
        };
    }

    public render(messages: string | string[]) {
        messages = castArray(messages);
        const options = this.options;

        const padding = options.padding || [];
        const padTop = padding.length > 0 ? padding[0] : 0;
        const padR = padding.length > 1 ? padding[1] : padTop;
        const padBottom = padding.length > 2 ? padding[2] : padTop;
        const padL = padding.length > 3 ? padding[3] : padR;

        const lines: string[] = [];
        const output = this.output;
        const formatter = output.getFormatter();

        const type = stringifyVar(options.type);
        const typeWidth = type ? StrUtil.width(type) + 1 : 0;

        const maxMessageWidth = Math.max(
            options.minWidth,
            ...messages.map((msg) => formatter.widthWithoutDecoration(msg)),
        );

        const maxWidth = Math.min(
            output.getWidth(),
            options.maxWidth,
            maxMessageWidth + typeWidth + padR + padL,
        );

        const chunkWidth = maxWidth - typeWidth - padL - padR;

        for (const message of messages) {
            const chunks = StrUtil.splitByWidth(message, chunkWidth);

            for (const chunk of chunks) {
                const prefix = 0 === lines.length ? type : "";

                const parts = [
                    StrUtil.spaces(padL),
                    padRight(prefix, typeWidth),
                    padRight(chunk, chunkWidth),
                    StrUtil.spaces(padR),
                ];

                lines.push(parts.join(""));
            }
        }

        const emptyLine = StrUtil.spaces(maxWidth);

        if (output.isDecorated()) {
            for (let i = 0; i < padTop; i++) {
                lines.unshift(emptyLine);
            }
            for (let i = 0; i < padBottom; i++) {
                lines.push(emptyLine);
            }
        }

        for (const line of lines) {
            const text = Formatter.formatText(line, options.style);

            output.writeln(text);
        }
    }
}
