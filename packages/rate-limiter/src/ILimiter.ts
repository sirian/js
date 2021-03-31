import {RateLimit} from "./RateLimit";

export interface ILimiter {
    consume(tokens: number): RateLimit;

    reset(): void;
}
