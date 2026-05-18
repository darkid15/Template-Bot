// src/commands/echo.js 

import sendReply from '../utils/message/sendReply.js';
import { warn } from '../utils/logger.js';

export default {
    name: "echo",
    category: "system",
    desc: "Repeat the user's message",
    usage: ":prefix:echo [ message ]",
    aliases: ["repeat", "say"],
    execute: async ({ sock, m, args }) => {
        try {
            if (!args || args.length === 0) {
                return sendReply(sock, m, `:error: Provide arguments, Baka!

Correct usage: \`:prefix:echo Hello World!\``);
            }
            let text = args.join(" ");
            await sendReply(sock, m, `You said: ${text}`);
        } catch (err) {
            warn(`Error running 'echo' command: ${err.stack || err.message || err}`);
        }
    }
}