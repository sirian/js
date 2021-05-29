import {Immediate} from "./Immediate";
import {Interval} from "./Interval";
import {TaskCallback} from "./TaskQueue";
import {Timeout} from "./Timeout";

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const startImmediate = (callback: TaskCallback) => Immediate.start(callback);

export const startTimeout = (ms: number, callback: TaskCallback) => Timeout.start(ms, callback);

export const startInterval = (ms: number, callback: TaskCallback) => Interval.start(ms, callback);
