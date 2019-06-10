import {Compiler} from "../Compiler";
import {ArrayNode} from "./ArrayNode";

export class ArgumentsNode extends ArrayNode {
    public compile(compiler: Compiler) {
        this.compileArguments(compiler);
    }
}
