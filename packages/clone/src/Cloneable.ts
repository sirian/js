export const cloneSymbol = Symbol.for("clone");

export interface Cloneable {
    [cloneSymbol]: () => void;
}
