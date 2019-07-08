import {TableStyle} from "./TableStyle";

export class BorderlessTableStyle extends TableStyle {
    constructor() {
        super();

        this.setHorizontalBorderChars("=")
            .setVerticalBorderChars(" ")
            .setDefaultCrossingChar(" ");
    }
}
