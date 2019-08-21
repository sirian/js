export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type AwaitedArray<T extends any[]> = { [P in keyof T]: Awaited<T[P]> };
