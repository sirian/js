import {assert, sleep} from "@sirian/common";
import {DateTimeImmutable} from "@sirian/datetime";
import {TimeUtil} from "./TimeUtil";

export class RateLimit {
    public readonly availableTokens: number;
    public readonly retryAfter: DateTimeImmutable;
    public readonly accepted: boolean;
    public readonly limit: number;

    constructor(availableTokens: number, retryAfter: DateTimeImmutable, accepted: boolean, limit: number) {
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
        return sleep(Math.max(0, this.retryAfter.timestampMs - TimeUtil.now()));
    }
}
