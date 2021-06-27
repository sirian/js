import {padLeft} from "@sirian/common";

export const padN = (value: string | number, length = 2) => padLeft(+value || 0, length, "0").substr(0, length);
