import {padLeft} from "@sirian/common";

export const formatNumber = (value: string | number, length: number = 2) => padLeft(+value || 0, length, "0").substr(0, length);
