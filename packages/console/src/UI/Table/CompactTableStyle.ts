import {TableStyle} from "./TableStyle";

export class CompactTableStyle extends TableStyle {
    constructor() {
        super();
        this.setHorizontalBorderChars("")
            .setVerticalBorderChars(" ")
            .setDefaultCrossingChar("")
            .setCellContentFormat("%s");
    }
}
