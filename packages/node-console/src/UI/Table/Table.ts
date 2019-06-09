import {sprintf, Str} from "@sirian/common";
import {InvalidArgumentError} from "../../Error";
import {Output} from "../../Output";
import {KV, StrUtil} from "../../Util";
import {TableRow} from "./TableRow";
import {TableSeparator} from "./TableSeparator";
import {TableStyle} from "./TableStyle";

export const enum Separator {
    TOP,
    TOP_BOTTOM,
    MID,
    BOTTOM,
}

export const enum Border {
    OUTSIDE,
    INSIDE,
}

export class Table {
    protected headers: TableRow[] = [];
    protected rows: TableRow[] = [];
    protected effectiveColumnWidths: number[] = [];
    protected columnsCount: number = 0;
    protected output: Output;
    protected style!: TableStyle;
    protected columnStyles: TableStyle[] = [];
    protected columnWidths: number[] = [];

    constructor(output: Output, headers: any[] = [], rows: any[][] = []) {
        this.output = output;

        this.setStyle(new TableStyle())
            .setHeaders(headers)
            .setRows(rows);
    }

    public setStyle(style: TableStyle) {
        this.style = style;

        return this;
    }

    public getStyle() {
        return this.style;
    }

    public setColumnStyle(columnIndex: number, style: TableStyle) {
        this.columnStyles[columnIndex] = style;

        return this;
    }

    public getColumnStyle(columnIndex: number) {
        return this.columnStyles[columnIndex] || this.getStyle();
    }

    public setColumnWidth(columnIndex: number, width: number) {
        this.columnWidths[columnIndex] = width;

        return this;
    }

    public setColumnWidths(widths: { [id: number]: number }) {
        this.columnWidths = [];

        for (const [index, width] of KV.entries(widths)) {
            this.setColumnWidth(+index, width);
        }

        return this;
    }

    public setHeaders(headers: string[]) {
        this.headers = [new TableRow(headers)];

        return this;
    }

    public setRows(rows: any[][]) {
        this.rows = [];

        return this.addRows(rows);
    }

    public addRows(rows: any[][]) {
        for (const row of rows) {
            this.addRow(row);
        }

        return this;
    }

    public addRow(values: any[]) {
        this.rows.push(new TableRow(values));

        return this;
    }

    public render() {
        const divider = new TableSeparator();

        const rows: TableRow[] = [...this.headers, divider, ...this.rows];

        this.calculateColumnsWidth(rows);

        this.renderRowSeparator(Separator.TOP);

        this.renderHeaders();
        this.renderBody();
    }

    public renderBody() {
        this.renderRows(this.rows, this.style.getCellBodyFormat());
        this.renderRowSeparator(Separator.BOTTOM);
    }

    public renderHeaders() {
        const headers = this.headers;

        if (!headers.length) {
            return;
        }

        this.renderRows(headers, this.style.getCellHeaderFormat());
        this.renderRowSeparator(Separator.TOP_BOTTOM);
    }

    public getCrossingChars(type: Separator) {
        const c = this.style.getCrossingChars();
        const b = this.style.getHorizontalBorderChars();

        switch (type) {
            case Separator.MID:
                return [b.inside, c.midLeft, c.midRight, c.cross];
            case Separator.TOP:
                return [b.outside, c.topLeft, c.topMid, c.topRight];
            case Separator.BOTTOM:
                return [b.outside, c.bottomLeft, c.bottomMid, c.bottomRight];
            case Separator.TOP_BOTTOM:
                return [b.outside, c.topLeftBottom, c.topMidBottom, c.topRightBottom];
            default:
                throw new InvalidArgumentError(`Invalid separator type "${type}"`);
        }
    }

    protected renderRows(rows: TableRow[], cellFormat: string) {
        for (const row of rows) {
            if (row instanceof TableSeparator) {
                this.renderRowSeparator(Separator.MID);
                continue;
            }

            this.renderRow(row, cellFormat);
        }
    }

    protected renderRowSeparator(type: Separator) {
        const count = this.columnsCount;

        if (!count) {
            return;
        }

        const style = this.style;

        const hBorders = style.getHorizontalBorderChars();

        if (!hBorders.outside && !hBorders.inside && !style.getCrossingChar()) {
            return;
        }

        const [horizontal, leftChar, midChar, rightChar] = this.getCrossingChars(type);

        const parts = [leftChar];

        for (let column = 0; column < count; ++column) {
            parts.push(horizontal.repeat(this.effectiveColumnWidths[column]));
            parts.push(column === count - 1 ? rightChar : midChar);
        }

        const line = sprintf(style.getBorderFormat(), parts.join(""));
        this.output.writeln(line);
    }

    protected renderColumnSeparator(type: Border = Border.OUTSIDE) {
        const style = this.style;
        const borders = style.getVerticalBorderChars();

        const content = sprintf(
            style.getBorderFormat(),
            Border.OUTSIDE === type ? borders.outside : borders.inside,
        );

        this.output.write(content);
    }

    protected renderRow(row: TableRow, cellFormat: string) {
        this.renderColumnSeparator(Border.OUTSIDE);

        for (let i = 0; i < this.columnsCount; i++) {
            if (i > 0) {
                this.renderColumnSeparator(Border.INSIDE);
            }
            this.renderCell(row, i, cellFormat);
        }

        this.renderColumnSeparator(Border.OUTSIDE);
        this.output.newLine();
    }

    protected renderCell(row: TableRow, column: number, cellFormat: string) {
        const cell = row.ensure(column);

        let width = this.effectiveColumnWidths[column];

        const style = this.getColumnStyle(column);

        const str = cell.toString();

        width += StrUtil.width(str) - this.output.getFormatter().widthWithoutDecoration(str);

        const content = sprintf(style.getCellRowContentFormat(), str);

        const formatted = sprintf(cellFormat, Str.pad(content, width, style.getPaddingChar(), style.getPadType()));

        this.output.write(formatted);
    }

    protected calculateColumnsWidth(rows: TableRow[]) {
        const sizes = rows.map((row) => row.size());

        this.columnsCount = Math.max(0, ...sizes);

        const formatter = this.output.getFormatter();

        for (let col = 0; col < this.columnsCount; col++) {
            const widths = rows
                .map((row) => row.ensure(col))
                .map((cell) => formatter.widthWithoutDecoration(cell.toString()));

            const maxLength = Math.max(this.columnWidths[col] || 0, ...widths);

            this.effectiveColumnWidths[col] = maxLength + this.style.getCellRowContentFormat().length - 2;
        }
    }
}
