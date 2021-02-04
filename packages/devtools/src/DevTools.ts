import {toArray} from "@sirian/common";
import {IDevToolsFormatter} from "./DevToolsFormatter";

declare global {
    interface Window {
        devtoolsFormatters?: IDevToolsFormatter[];
    }
}

export class DevTools {
    public static getFormatters(win = window) {
        return win.devtoolsFormatters || [];
    }

    public static addFormatter(formatter: IDevToolsFormatter, win = window) {
        const formatters = [...this.getFormatters(win), formatter];
        formatters.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return DevTools.setFormatters(formatters);
    }

    public static removeFormatter(formatter: IDevToolsFormatter, win = window) {
        const formatters = this.getFormatters(win).filter((f) => f !== formatter);
        DevTools.setFormatters(formatters, win);
        return DevTools;
    }

    public static setFormatters(formatters: IDevToolsFormatter[], win = window) {
        win.devtoolsFormatters = toArray(formatters);
        return DevTools;
    }
}
