import {CloneContext} from "./CloneContext";

export interface CloneOptions {
    maxDepth: number;
    bypass: (object: object, ctx: CloneContext) => boolean;
}

export interface ICloner<T> {
    clone<U extends T>(src: U, options: CloneOptions): U;
}
