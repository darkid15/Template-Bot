// src/utils/commandsLoader.js

import { cmdDir } from '../configs/paths.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from "url";
import { info, warn } from  './logger.js';

export default async function loadCommands() {
    const files = fs.readdirSync(cmdDir).filter(f => f.endsWith(".js"));

    const commands = new Map();
    const aliases = new Map();

    for (const file of files) {
        try {
            const fullPath = path.join(cmdDir, file);
            const fileUrl = pathToFileURL(fullPath).href;

            // import module
            const imported = await import(fileUrl);

            // get default export
            const cmd = imported.default;

            if (!cmd?.name || !cmd?.execute) continue;

            commands.set(cmd.name.toLowerCase(), cmd);

            if (cmd.aliases && Array.isArray(cmd.aliases)) {
                for (const alias of cmd.aliases) {
                    aliases.set(alias.toLowerCase(), cmd);
                }
            }

        } catch (err) {
            warn(
                `Error loading command: ${file}\nError: ${err.stack || err.message || err}`
            );
        }
    }
    info(`Loaded Commands: ${commands.size || aliases.size || 0}`);
    return { commands, aliases };
}