import {StrSide} from "@sirian/common";
import {LogicError} from "../../Error";

export interface ITableCrossingChars {
    cross: string;
    topLeft: string;
    topMid: string;
    topRight: string;

    midRight: string;
    midLeft: string;

    bottomRight: string;
    bottomMid: string;
    bottomLeft: string;

    topLeftBottom: string;
    topMidBottom: string;
    topRightBottom: string;
}

export interface ITableBorderChars {
    inside: string;
    outside: string;
}

export class TableStyle {
    protected paddingChar = " ";

    protected crossingChars!: ITableCrossingChars;
    protected horizontalBorderChars!: ITableBorderChars;
    protected verticalBorderChars!: ITableBorderChars;

    protected cellHeaderFormat = "<info>%s</info>";
    protected cellBodyFormat = "%s";
    protected cellContentFormat = " %s ";
    protected borderFormat = "%s";
    protected padType = StrSide.RIGHT;

    constructor() {
        this.setDefaultCrossingChar("+")
            .setHorizontalBorderChars("-")
            .setVerticalBorderChars("|");
    }

    public getCrossingChars() {
        return this.crossingChars;
    }

    public setPaddingChar(paddingChar: string) {
        if (!paddingChar) {
            throw new LogicError("The padding char must not be empty");
        }

        this.paddingChar = paddingChar;

        return this;
    }

    public getPaddingChar() {
        return this.paddingChar;
    }

    public setHorizontalBorderChars(outside: string, inside?: string) {
        this.horizontalBorderChars = {
            inside: inside || outside,
            outside,
        };

        return this;
    }

    public getHorizontalBorderChars() {
        return this.horizontalBorderChars;
    }

    public getVerticalBorderChars() {
        return this.verticalBorderChars;
    }

    public setVerticalBorderChars(outside: string, inside?: string) {
        this.verticalBorderChars = {
            inside: inside || outside,
            outside,
        };

        return this;
    }

    public setCrossingChars(chars: ITableCrossingChars) {
        this.crossingChars = chars;

        // todo
        // this.crossingTopLeftBottomChar = topLeftBottom ? ? midLeft;
        // this.crossingTopMidBottomChar = topMidBottom ? ? cross;
        // this.crossingTopRightBottomChar = topRightBottom ? ? midRight;

        return this;
    }

    public setDefaultCrossingChar(char: string) {
        return this.setCrossingChars({
            cross: char,
            topLeft: char,
            topMid: char,
            topRight: char,
            midRight: char,
            bottomRight: char,
            bottomMid: char,
            bottomLeft: char,
            midLeft: char,
            topLeftBottom: char,
            topMidBottom: char,
            topRightBottom: char,
        });
    }

    public getCrossingChar() {
        return this.crossingChars.cross;
    }

    public setCellHeaderFormat(format: string) {
        this.cellHeaderFormat = format;

        return this;
    }

    public getCellHeaderFormat() {
        return this.cellHeaderFormat;
    }

    public setCellBodyFormat(format: string) {
        this.cellBodyFormat = format;

        return this;
    }

    public getCellBodyFormat() {
        return this.cellBodyFormat;
    }

    public setCellContentFormat(format: string) {
        this.cellContentFormat = format;

        return this;
    }

    public getCellRowContentFormat() {
        return this.cellContentFormat;
    }

    public setBorderFormat(format: string) {
        this.borderFormat = format;

        return this;
    }

    public getBorderFormat() {
        return this.borderFormat;
    }

    public setPadType(padType: StrSide) {
        this.padType = padType;

        return this;
    }

    public getPadType() {
        return this.padType;
    }
}
