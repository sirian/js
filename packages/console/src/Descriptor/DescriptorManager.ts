import {InvalidArgumentError} from "../Error";
import {Output} from "../Output";
import {Descriptor} from "./Descriptor";
import {JsonDescriptor} from "./JsonDescriptor";
import {TextDescriptor} from "./TextDescriptor";

type IDescriptorConstructor = new(output: Output) => Descriptor;

export class DescriptorManager {
    protected static instance?: DescriptorManager;
    protected descriptors: Map<string, IDescriptorConstructor> = new Map();

    protected constructor() {
        this.register("txt", TextDescriptor)
            .register("json", JsonDescriptor);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    public getFormats() {
        return [...this.descriptors.keys()];
    }

    public createDescriptor(format: string, output: Output) {
        const descriptors = this.descriptors;

        if (!descriptors.has(format)) {
            throw new InvalidArgumentError(
                `Unsupported format "${format}". Supported: ${this.getFormats().join(", ")}`,
            );
        }

        const descriptorConstructor = descriptors.get(format)!;

        const descriptor: Descriptor = new descriptorConstructor(output);

        return descriptor;
    }

    public register(format: string, descriptor: IDescriptorConstructor) {
        this.descriptors.set(format, descriptor);

        return this;
    }
}
