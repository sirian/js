export type IFilterCallback<V = any> = (value: V) => boolean;

export interface IFilter<V = any> {
    test: IFilterCallback<V>;
}

export type Filter<V = any> = IFilter<V> | IFilterCallback<V>;
