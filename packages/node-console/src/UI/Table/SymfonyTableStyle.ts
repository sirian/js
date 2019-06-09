import {TableStyle} from "./TableStyle";

export class SymfonyTableStyle extends TableStyle {
    constructor() {
        super();

        this.setHorizontalBorderChars("-")
            .setVerticalBorderChars(" ")
            .setDefaultCrossingChar(" ")
            .setCellHeaderFormat("%s");
    }
}
