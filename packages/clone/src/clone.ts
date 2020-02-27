import {Cloner} from "./Cloner";

export const cloner = new Cloner();
export const clone = cloner.clone.bind(cloner);
export const cloneDeep = cloner.cloneDeep.bind(cloner);
