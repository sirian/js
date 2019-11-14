import {Descriptor, DescriptorType, Obj, Ref, Var} from "@sirian/common";
import {CloneOptions, Cloner, ValidateError} from "./index";

export class CloneValidator {
    protected stack!: Array<[object, PropertyKey]>;
    protected cloner: Cloner;
    protected options!: Partial<CloneOptions>;
    protected map: Map<object, [object, number]>;

    public constructor(cloner: Cloner = Cloner.defaultCloner) {
        this.cloner = cloner;
        this.map = new Map();
    }

    public static validate(src: any, clone: any, options: Partial<CloneOptions> = {}) {
        const validator = new CloneValidator();
        validator.validate(src, clone, options);
    }

    protected get maxDepth() {
        return this.options.maxDepth || 0;
    }

    public validate(src: any, clone: any, options: Partial<CloneOptions> = {}) {
        this.stack = [];
        this.options = options;
        this.map.clear();

        try {
            this.doValidate(src, clone);
        } catch (e) {
            const path = this.stack.map(([obj, key]) => key);
            throw new ValidateError(src, clone, path, e);
        }
    }

    protected assertEqual(src: any, clone: any) {
        if (!Var.isEqual(src, clone)) {
            throw new Error(`Values mismatch. Expected ${src}, given ${clone} `);
        }
    }

    protected assertNotEqual(src: any, clone: any) {
        if (Var.isEqual(src, clone)) {
            throw new Error(`Values equal, but should not. Given ${clone} `);
        }
    }

    protected doValidate(src: any, clone: any) {
        const type1 = typeof src;
        const type2 = typeof clone;
        const stack = this.stack;

        if (type1 !== type2) {
            throw new Error(`Types mismatch. Expected ${type1}, given ${type2}`);
        }

        if (Var.isPrimitive(src) || Var.isPrimitive(clone) || !this.cloner.supports(src)) {
            return this.assertEqual(src, clone);
        }

        const maxDepth = this.maxDepth;

        const map = this.map;

        if (map.has(src)) {
            const expected = map.get(src);
            if (stack.length <= maxDepth) {
                this.assertEqual(expected, clone);
            } else {
                this.assertNotEqual(expected, clone);
            }
        } else {
            if (stack.length <= maxDepth) {
                this.assertNotEqual(src, clone);
            } else {
                this.assertEqual(src, clone);
            }
        }

        this.validateStructure(src, clone);
    }

    protected validateStructure(src: object, clone: object) {
        const stack = this.stack;

        if (stack.length > this.maxDepth || Var.isEqual(src, clone)) {
            return;
        }

        for (const key of Obj.keys(src)) {
            if (this.checkCircle(src, key)) {
                continue;
            }
            stack.push([src, key]);
            this.validateKey(src, clone, key);
            stack.pop();
        }
    }

    protected checkCircle(obj: object, key: PropertyKey) {
        for (const [obj2, key2] of this.stack) {
            if (obj === obj2 && key === key2) {
                return true;
            }
        }
        return false;
    }

    protected validateKey(src: object, clone: object | object, key: PropertyKey) {
        const desc1 = Ref.ownDescriptor(src, key);
        const desc2 = Ref.ownDescriptor(clone, key);

        const type1 = Descriptor.getDescriptorType(desc1);
        const type2 = Descriptor.getDescriptorType(desc2);

        if (type1 !== type2) {
            throw new Error(`Decsriptor types mismatch. Expected ${type1}, given ${type2}`);
        }

        switch (type1) {
            case DescriptorType.ACCESSOR:
                if (!Var.isEqual(desc1!.get, desc2!.get)) {
                    throw new Error(`Descriptor "get" mismatch`);
                }
                if (!Var.isEqual(desc1!.set, desc2!.set)) {
                    throw new Error(`Descriptor "set" mismatch`);
                }
                break;
            case DescriptorType.DATA:
                this.doValidate(desc1!.value, desc2!.value);
                break;
            default:
                throw new Error(`Unexpected decsriptor type ${type1}`);
        }

        for (const k of ["writable", "configurable", "enumerable"] as const) {
            const v1 = desc1![k];
            const v2 = desc2![k];
            if (!Var.isEqual(v1, v2)) {
                throw new Error(`Descriptor "${k}" mismatch. Expected ${v1}, given ${v2}`);
            }
        }
    }
}
