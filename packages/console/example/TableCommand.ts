import {
    BorderlessTableStyle,
    BoxDoubleTableStyle,
    BoxTableStyle,
    Command,
    CommandDefinition,
    Option,
    TableStyle,
} from "../src";

export class TableCommand extends Command {
    protected static styles: Record<string, TableStyle> = {
        default: new TableStyle(),
        borderless: new BorderlessTableStyle(),
        box: new BoxTableStyle(),
        double: new BoxDoubleTableStyle(),
    };

    public static configure(definition: CommandDefinition) {
        definition
            .setName("table")
            .setDescription("Example of tables")
            .setOptions({
                style: new Option({
                    shortcut: "s",
                    allowedValues: this.getStyleNames(),
                    description: "Table style",
                    default: "default",
                    valueRequired: true,
                }),
            })
        ;

    }

    protected static getStyleNames() {
        return Object.keys(this.styles);
    }

    public execute() {
        const io = this.io;
        const styleName = io.input.getOption("style");

        const table = io
            .createTable()
            .setHeaders(["foo", "bar", "baz"])
            .setRows([
                [0, 0, 0],
                [new Date(), 1],
            ])
        ;

        const style = TableCommand.styles[styleName];

        table.setStyle(style);
        io.writeln(`Render table with <comment>${styleName}</comment> style`);

        table.render();

    }
}
