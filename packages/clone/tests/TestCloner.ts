import {clone, CloneOptions, CloneValidator} from "../src";

export class TestCloner {
    public static multiTest(target: any) {
        const depths = [undefined, 0, 1, 2, 3, 4, 1 / 0];

        const data = depths.map<[any, Partial<CloneOptions>]>((maxDepth) => [target, {maxDepth}]);

        test.each(data)("clone(%O, %O)", (obj, options) => {
            const cloned = clone(obj, options);
            const validator = new CloneValidator();
            validator.validate(obj, cloned, options);
        });
    }
}
