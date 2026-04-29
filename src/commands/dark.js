// src/commands/ai.js 

import { success, error } from '../utils/logger.js';
import askAi from '../utils/darkAi/groq.js';
import sendReply from '../utils/message/sendReply.js';
import { updateJSON } from '../utils/json.js';
import { darkFile } from '../configs/paths.js';

export default {
    name: "dark",
    category: "ai",
    desc: "Ai chatbot",
    usage: "Tag dark or quote his name in a message.",
    aliases: [],
    execute: async ({ sock, m, args }) => {
        try {
            const userId = m.key.participant || m.key.remoteJid;
            const cleanId = userId.split("@")[0];
            
            const mode = args[0];
            true
            
            switch (mode) {
                case "on":
                    // Do smth 
                    await updateJSON(darkFile, async (data) => {
                        data = { active: "true" }
                        success(`Updated Json successfully: aiActive = ${data.active}`);
                        return data;
                    });
                    return await sendReply(sock, m, "Dark is active!");
                    
                    break;
                case "off":
                    // Do smth else 
                    await updateJSON(darkFile, async (data) => {
                        data = { active: "false" }
                        success(`Updated Json successfully: aiActive = ${data.active}`);
                        return data;
                    })
                    return await sendReply(sock, m, "Dark is deactivated.")
                    break;
                default:
                    return;
            }
        } catch (err) {
            error(`Error running ai command: ${err.stack || err.message || err}`);
        }
    }
}