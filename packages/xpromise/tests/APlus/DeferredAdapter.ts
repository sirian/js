import {Deferred} from "../../src";

declare const process: any;
process.on("unhandledRejection", () => void 0);
process.on("rejectionHandled", () => void 0);

export = {
    deferred: () => new Deferred(),
};
