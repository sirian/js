// import {Arr, Obj, Var,isNull,isUndefined,isNullable,getXType,isXType,isType,isSome,isNumber,isBigInt,isBoolean,isString,isPropertyKey,isPrimitive,isSymbol,isFunction,isConstructor,isTruthy,isFalsy,isObject,isNumeric,isPromiseLike,isObjectOrFunction,isInstanceOf,isEqualNaN,isSubclassOf,isSameType,isBetween,isArray,isArrayLike,isPlain,isPlainArray,isRegExp,stringify,isAsyncIterable,isIterable,isEqual,isPlainObject} from "@sirian/common";
// import {LogRecord} from "../LogRecord";
// import {TagToken} from "../parser/token";
// import {ConsoleFormatter, ConsoleFormatterInit} from "./ConsoleFormatter";
// import {ChromeDevtoolsFormatter} from "./devtools/ChromeDevtoolsFormatter";
// import {JML} from "./devtools/JML";
// import {JsonML, JsonMLAttr, JsonMLTag} from "./devtools/JsonML";
// import {FormatContext} from "./FormatContext";
// import {StyleStack} from "./StyleStack";
// import {Placeholder} from "./Placeholder";
// import {Style, StyleInit} from "./Style";
//
// export interface DevtoolsFormatterInit extends ConsoleFormatterInit {
//
// }
//
// // noinspection CommaExpressionJS
// const window = (0, eval)("this");
//
// export class DevtoolsFormatter extends ConsoleFormatter implements ChromeDevtoolsFormatter {
//     protected tagMap: Record<string, JsonMLTag> = {
//         ol: "ol",
//         ul: "ol",
//         li: "li",
//
//         span: "span",
//         div: "div",
//
//         table: "table",
//         tr: "tr",
//         th: "td",
//         td: "td",
//     };
//
//     protected contexts: WeakMap<any[], FormatContext>;
//
//     constructor(init: Partial<DevtoolsFormatterInit> = {}) {
//         super(init);
//
//         this.contexts = new WeakMap();
//         this.register();
//     }
//
//     public register(w: { devtoolsFormatters?: ChromeDevtoolsFormatter[] } = window) {
//         const dt = w.devtoolsFormatters || [];
//         dt.push(this);
//         w.devtoolsFormatters = dt;
//     }
//
//     public unregister(w: { devtoolsFormatters?: ChromeDevtoolsFormatter[] } = window) {
//         const dt = w.devtoolsFormatters || [];
//         w.devtoolsFormatters = dt.filter((f) => f !== this);
//     }
//
//
//
//     public header(object: any, options?: any) {
//         const ctx = this.contexts.get(object);
//
//         if (!ctx) {
//             return null;
//         }
//
//         const root = new JML("log");
//         let node = root;
//
//         const stack = new StyleStack();
//
//         for (const value of ctx.getFormatted()) {
//             if (!Var.isInstanceOf(value, TagToken)) {
//                 if (value.closing) {
//                     node = node.closest(value.tag) || root;
//                 } else {
//                     const child = JML
//                         .fromToken(value)
//                         .setParent(node);
//
//                     node.append(child);
//                 }
//                 continue;
//             }
//
//             node.append(value);
//         }
//
//         return this.transform(root);
//     }
//
//     public hasBody(object: any, options?: any) {
//         return false;
//     }
//
//     public body(object: any, options?: any) {
//         return null;
//     }
//
//     public transform(value: any): JsonML {
//         if (Var.isInstanceOf(value, JML)) {
//             const tag: JsonMLTag = this.tagMap[value.tagName] || "span";
//             const children = value.getChildren().map((child) => this.transform(child));
//             const style = this.computeStyle(value);
//             const attributes: JsonMLAttr = {style};
//             return [tag, attributes, ...children];
//         }
//
//         if (Var.isInstanceOf(value, Placeholder)) {
//             const config = {
//                 type: value.type,
//                 options: value.options,
//             };
//             const object = value.value;
//             return ["object", {object, config}];
//         }
//
//         return ["span", {}, value];
//     }
//
//
//     protected formatRecord(record: LogRecord) {
//         const ctx = super.formatRecord(record);
//         const arr = Arr.cast(ctx.getFormatted());
//         ctx.setFormatted(arr);
//         this.contexts.set(arr, ctx);
//         return ctx;
//     }
// }
