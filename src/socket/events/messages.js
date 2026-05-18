// src/socket/events/messages.js 

import handleNewMessages from "../../handlers/newMsgHandler.js"
import { warn, info } from '../../utils/logger.js';

export default async function handleMsgUpdates (sock, messages, type, commands, settings) {
    if (!sock?.user) return;    // If user is not registered
    info(":msgBubble: Handling message updates...")
    const { bot } = settings;
    const master = bot?.master?.phone;
    for (const m of messages) {
        if (!m) continue;
        try {
            switch (type) {
                case "notify":  // Handle new messages ONLY 
                    info("Now handling new messages...");
                    await handleNewMessages(sock, m, commands, bot);
                    break;
                case "append":
                    // Handle append type messages here 
                    continue;
                default:
                    return warn(`Unsupported message type: ${type}`);
            }
        } catch (err) {
            warn(`Error processing message updates: ${err.stack || err.message || err}`);
            await sendReply(sock, `${master}@s.whatsapp.net`, err);
            return;
        }
    }
}