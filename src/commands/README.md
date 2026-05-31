# Template Bot Commands

## Table of Contents
- [Commands Structure](#commands-structure)
- [Breakdown](#command-object-breakdown)
- [Adding New Commands](#adding-a-new-command)
    - [Command Execution Parameters](#command-execution-parameters)
- [Structure Enforcement](#structure-enforcement)

## Commands Structure
All command modules must export a single default object, which contains the command’s metadata and execution logic.
```JavaScript
// src/commands/example-cmd.js

// import module to send text 
import sendReply from '../utils/message/sendReply.js';

export default {
    // the command name 
    name: "myCmd",
    category: "system",
    desc: "A command that does something.",
    usage: "[prefix][command name], e.g. !myCmd",
    // Leave aliases as [] if no aliases are needed.
    aliases: ["a-short-alias", "another-alias"],

    // the actual command logic
    execute: async ({ sock, m }) => {
        // sends a WhatsApp message 
        return sendReply(sock, m, "This command does something.");
    }
};
```

## Command Object Breakdown
The default export object contains six main properties:
- `name`
The name of the command. This is what the user types to run the command.
It also serves as the display name.
- `category`
Used mainly in the menu and help commands to group commands for better organization.
- `desc`
A short description of what the command does.
- `usage`
Shows the user how to properly use the command.
- `aliases`
Alternative names for the command.
Example: If a command is named "profile" and "p" is in aliases, the user can run `!p` instead of `!profile`.
There is no strict limit to aliases, but avoid duplicate aliases across commands.
- `execute`
The core function of the command.
This is what your command handler calls when the command is triggered.

## ⚠️ Important Note
The commands loader will NOT load a command if it does not include `name` and `execute`.
All other properties are optional, but strongly recommended for consistency and usability.
## Adding a New Command
When creating a new command, follow this structure:
```JavaScript
export default {
    name: "fun",   // REQUIRED
    category: "fun",
    desc: "A fun command.",
    usage: "!fun",
    aliases: [],

    execute: async ({ sock, m }) => {
        // Your logic here
    }
};
```

## ⚠️ Structure Enforcement
This object structure must be strictly followed.
If you modify it, you must also update the following files to match the new structure:
- [Commands Loader](../utils/commandsLoader.js)
- [Message Handler](../handlers/newMsgHandler.js)
- [Menu Command](./menu.js)
- [Help Command](./help.js)