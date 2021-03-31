import {Return} from "@sirian/ts-extra-types";
import {ILimiterState} from "./ILimiterState";

export interface IStorage<T extends ILimiterState> {
    save(limiterState: T): void;

    fetch(limiterStateId: string, unserialize: (data: Return<T["serialize"]>) => T): T | undefined;

    delete(limiterStateId: string): void;
}
