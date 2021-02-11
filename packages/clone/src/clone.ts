import {Cloner} from "./Cloner";
import {CloneOptions} from "./ICloner";

export const cloner = new Cloner();
export const clone = <T>(src: T, options: Partial<CloneOptions> = {}) => cloner.clone(src, options);
export const cloneDeep = <T>(src: T, options: Partial<CloneOptions> = {}) => cloner.cloneDeep(src, options);
