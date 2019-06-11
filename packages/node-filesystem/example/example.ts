import {RecursiveDirectoryIterator} from "../src";

(async () => {
    const it = new RecursiveDirectoryIterator("/tmp");
    for await (const file of it) {
        console.log(file.relativePath); // tslint:disable-line:no-console
    }
})();
