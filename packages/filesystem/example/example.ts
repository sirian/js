import {RecursiveDirectoryIterator} from "../src";

void (async () => {
    const it = new RecursiveDirectoryIterator("/tmp");
    for await (const file of it) {
        console.log(file.relativePath);
    }
})();
