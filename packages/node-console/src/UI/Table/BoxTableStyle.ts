import {TableStyle} from "./TableStyle";

export class BoxTableStyle extends TableStyle {
    constructor() {
        super();

        this.setHorizontalBorderChars("─")
            .setVerticalBorderChars("│")
            .setCrossingChars({
                cross: "┼",
                topLeft: "┌",
                topMid: "┬",
                topRight: "┐",
                midRight: "┤",
                bottomRight: "┘",
                bottomMid: "┴",
                bottomLeft: "└",
                midLeft: "├",
                topLeftBottom: "├",
                topMidBottom: "┼",
                topRightBottom: "┤",
            });
    }
}
