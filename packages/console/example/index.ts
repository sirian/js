import {Application} from "../src";
import {HelloCommand} from "./HelloCommand";
import {ProgressCommand} from "./ProgressCommand";
import {TableCommand} from "./TableCommand";

const app = new Application({
    name: "Example application",
    commands: [
        HelloCommand,
        ProgressCommand,
        TableCommand,
    ],
});

void app.run();
