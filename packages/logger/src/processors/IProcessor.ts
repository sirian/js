export interface IProcessor<T> {
    process(value: T): void;
}
