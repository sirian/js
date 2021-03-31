import {isNumber} from "@sirian/common";
import {Return} from "@sirian/ts-extra-types";
import {ILimiterState} from "./ILimiterState";
import {IStorage} from "./IStorage";
import {TimeUtil} from "./TimeUtil";

export class MemoryStorage<T extends ILimiterState> implements IStorage<T> {
    private buckets = new Map<string, [number | undefined, Return<T["serialize"]>]>();

    public save(limiterState: T): void {
        const data = this.buckets.get(limiterState.id);

        const expireMs = limiterState.getExpirationMs();

        const expireAt = isNumber(expireMs) ? TimeUtil.now() + expireMs : data?.[0];

        this.buckets.set(limiterState.id, [expireAt, limiterState.serialize()]);
    }

    public fetch(limiterStateId: string, unserialize: (data: Return<T["serialize"]>) => T): T | undefined {
        const data = this.buckets.get(limiterStateId);
        if (!data) {
            return;
        }
        const [expireAt, limiterState] = data;
        if (isNumber(expireAt) && expireAt <= TimeUtil.now()) {
            this.buckets.delete(limiterStateId);
            return;
        }

        return unserialize(limiterState);
    }

    public delete(limiterStateId: string): void {
        this.buckets.delete(limiterStateId);
    }
}
