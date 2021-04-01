import {assert, sleep} from "@sirian/common";
import {TimeUtil} from "./TimeUtil";

export class RateLimit {
    public readonly availableTokens: number;
    public readonly retryAfter: number;
    public readonly accepted: boolean;
    public readonly limit: number;

    constructor(availableTokens: number, retryAfter: number, accepted: boolean, limit: number) {
        this.availableTokens = availableTokens;
        this.retryAfter = retryAfter;
        this.accepted = accepted;
        this.limit = limit;
    }

    public ensureAccepted() {
        assert(this.accepted, "RateLimit");

        return this;
    }

    public wait() {
        return sleep(Math.max(0, this.retryAfter - TimeUtil.now()));
    }
}
