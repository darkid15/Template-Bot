// src/commands/echo.js 

import sendReply from '../utils/message/sendReply.js';
import { warn } from '../utils/logger.js';
import { assetsDir } from '../configs/paths.js';
import path from 'path';
import fs from "fs";

const thumb = fs.readFileSync(
    path.join(assetsDir, "crystal.jpg")
);

export default {
    name: "echo",
    category: "system",
    desc: "Repeat the user's message",
    usage: ":prefix:echo [ message ]",
    aliases: ["repeat", "say"],
    execute: async ({ sock, m, args }) => {
        try {
            if (!args || args.length === 0) return sendReply(sock, m, ":error: Provide arguments, Baka!\n\nCorrect usage: \`:prefix:echo Hello World!\`");
            await sendReply(sock, m, `You said: ${args}`);
            
            const jid = m.key.remoteJid;
            try{
                await sock.sendMessage(jid, {
                    text: "Moonstones Treasury",
                    contextInfo: {
                        externalAdReply: {
                            title: "◉ _DARKID_ ◉",
                            body: "100",
                            thumbnail: thumb,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false
                        }
                    }
                });
            } catch (err) {
                warn(`Err sending ad reply: ${err.stack || err.message || err}`);
            }
        } catch (err) {
            warn(`Error running 'echo' command: ${err.stack || err.message || err}`);
        }
    }
}