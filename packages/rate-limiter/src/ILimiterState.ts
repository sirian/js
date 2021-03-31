export interface ILimiterState {
    id: string;

    getExpirationMs(): number | undefined;

    serialize(): any;
}
