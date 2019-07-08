import * as path from "path";

export class TestUtil {
    static get resourcePath() {
        return path.join(__dirname, "/../resources");
    }
}
