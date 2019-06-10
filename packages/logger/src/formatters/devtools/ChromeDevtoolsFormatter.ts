import {JsonML} from "./JsonML";

export interface ChromeDevtoolsFormatter {
    header: (object: any, options?: any) => null | JsonML;
    hasBody: (object: any, options?: any) => boolean;
    body: (object: any, options?: any) => null | JsonML;
}
