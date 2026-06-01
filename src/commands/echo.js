// src/commands/echo.js 

import sendQueuedReply from '../utils/message/replyQueue.js';

export default {
    name: "echo",
    category: "system",
    desc: "Repeat the user's message",
    usage: ":prefix:echo [ message ]",
    aliases: ["repeat", "say"],
    execute: async ({ sock, m, args, logger }) => {
		const { warn } = logger;
        try {
            if (!args || args.length === 0) {
                return sendQueuedReply(sock, m, `:error: Provide arguments, Baka!

Correct usage: \`:prefix:echo Hello World!\``);
            }
            let text = args.join(" ");
            await sendQueuedReply(sock, m, `You said: ${text}`);
        } catch (err) {
            warn(`Error running 'echo' command: ${err.stack || err.message || err}`);
        }
    }
}