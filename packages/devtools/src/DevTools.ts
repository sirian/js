import {Arr} from "@sirian/common";
import {IDevToolsFormatter} from "./DevToolsFormatter";

declare global {
    interface Window {
        devtoolsFormatters?: IDevToolsFormatter[];
    }
}

export class DevTools {
    public static getFormatters(win = window) {
        return win.devtoolsFormatters = (win.devtoolsFormatters || []);
    }

    public static addFormatter(formatter: IDevToolsFormatter, win = window) {
        this.getFormatters(win).push(formatter);
        return DevTools;
    }

    public static removeFormatter(formatter: IDevToolsFormatter, win = window) {
        Arr.removeItem(this.getFormatters(win), formatter);
        return DevTools;
    }

    public static setFormatters(formatters: IDevToolsFormatter[], win = window) {
        win.devtoolsFormatters = formatters;
        return DevTools;
    }
}
