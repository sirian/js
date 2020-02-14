import {hasMethod, isArray, isObject, valuesOf} from "@sirian/common";
import {Compiler} from "../Compiler";
import {IExpressionFunction} from "../IExpressionFunction";
import {Node} from "./Node";

export enum AccessType {
    PROPERTY = "Property",
    METHOD = "Method",
    ARRAY = "Array",
}

export class AccessNode extends Node<{ node: Node, key: Node, args: Node }, { type: AccessType }> {
    public compile(compiler: Compiler) {
        const {args, node, key} = this.nodes;
        const value = key.options.value;

        switch (this.options.type) {
            case AccessType.PROPERTY:
                compiler
                    .compile(node)
                    .raw(".")
                    .raw(value)
                ;
                break;

            case AccessType.METHOD:

                compiler
                    .compile(node)
                    .raw(".")
                    .raw(value)
                    .raw("(")
                    .compile(args)
                    .raw(")")
                ;
                break;

            case AccessType.ARRAY:
                compiler
                    .compile(node)
                    .raw("[")
                    .compile(key)
                    .raw("]")
                ;
                break;
        }
    }

    public evaluate(functions: Record<string, IExpressionFunction>, values: Record<string, any>) {
        const {key, args, node} = this.nodes;
        const obj = node.evaluate(functions, values);

        const value = key.options.value;

        switch (this.options.type) {
            case AccessType.PROPERTY:
                if (!isObject(obj)) {
                    throw new Error("Unable to get a property on a non-object.");
                }

                return obj[value];

            case AccessType.METHOD:
                if (!isObject(obj)) {
                    throw new Error("Unable to get a property on a non-object.");
                }

                if (!hasMethod(obj, value)) {
                    throw new Error(`Unable to call method "${value}" of object "${this.constructor.name}".`);
                }

                return obj[value](...valuesOf(args.evaluate(functions, values)));

            case AccessType.ARRAY:
                if (!isArray(obj)) {
                    throw new Error("Unable to get an item on a non-array.");
                }

                return obj[key.evaluate(functions, values)];
        }
    }
}
