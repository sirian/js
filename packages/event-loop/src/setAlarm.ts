import {Func0} from "@sirian/ts-extra-types";

const alarms = new Map<any, [ts: number, fn: Func0, timeoutId?: any]>();

let alarmIntervalId: any | undefined;

const now = () => Date.now();

const checkIntervalMs = 1000;

export const setAlarm = (ms: number, fn: Func0): any => {
    alarmIntervalId ??= setInterval(handleAlarms, checkIntervalMs);
    const id = setTimeout(() => {}, ms);
    clearTimeout(id);
    alarms.set(id, [now() + ms, fn]);
    if (ms <= checkIntervalMs) {
        scheduleAlarm(id, ms, fn);
    }
    return id;
};

export const clearAlarm = (id: any) => {
    const alarm = alarms.get(id);
    alarms.delete(id);
    clearTimeout(alarm?.[2]);
    if (!alarms.size) {
        clearInterval(alarmIntervalId);
        alarmIntervalId = void 0;
    }
};

const scheduleAlarm = (id: any, ms: number, fn: Func0) => {
    const alarm = alarms.get(id);
    if (alarm) {
        alarm[2] ??= setTimeout(() => {
            clearAlarm(id);
            fn();
        }, ms);
    }
};

const handleAlarms = () => {
    const nowTs = now();
    for (const [id, [ts, fn]] of alarms) {
        const remainingMs = ts - nowTs;
        if (remainingMs < checkIntervalMs) {
            scheduleAlarm(id, remainingMs, fn);
        }
    }
};
