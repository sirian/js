export interface IFormatter<T = any, U = any> {
    format(value: T): U;
}
