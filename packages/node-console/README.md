# Console

[![Npm version](https://badge.fury.io/js/@sirian%2Fconsole.svg)](https://www.npmjs.com/package/@sirian/console)
[![LICENSE](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```shell
npm install @sirian/console
```


## Example


```typescript
import {Application, Argument, Command, CommandDefinition} from "@sirian/console";

class HelloCommand extends Command {
    static configure(definition: CommandDefinition) {
        definition
            .setDescription("Simple command example")
            .setArguments({
                name: new Argument({
                    defaultValue: "Nobody",
                    required: false,
                }),
            });
    }

    execute() {
        const io = this.io;
        const name = io.input.getArgument("name");
        io.success("Great, you did it!");
        io.writeln(`Hello <info>${name}</info>!`);
    }
}

const app = new Application({
    name: "Example",
    commands: [
        HelloCommand
    ]
});
app.run();
```


