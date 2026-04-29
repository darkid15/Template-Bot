// src/handlers/newMsgHandler.js 

import extractText from '../utils/message/extractText.js'
import analyzeObject from '../utils/message/analyze.js';
import sendReply from '../utils/message/sendReply.js';
import { info, warn, error } from '../utils/logger.js';
import { readJSON } from '../utils/json.js';
import askDark from '../utils/darkAi/groq.js';
import { darkFile } from '../configs/paths.js';
import { getTargetUser } from '../utils/message/tags.js';
import {
    botName,
    prefix
} from '../configs/index.js';

export default async function handleNewMessages (sock, m, cmds, settings) {
    const { commands, aliases } = cmds;
    const { master } = settings;
    const userId = m.key.participant || m.key.remoteJid;
    const cleanId = userId?.split("@")[0] || "unknown";
    let darkConfigs;
    try {
        if (!m.message) return warn("No message object detected!");
        // extract text 
        const text = await extractText(m);
        if (!text) return;
        
        const isCommand = text.startsWith(prefix);
        if (!isCommand) darkConfigs = await readJSON(darkFile, { active: "false" }) || { active: "false" };
        if (darkConfigs?.active=== "true" && !isCommand) {
            const botLid = sock.user.lid.split(":")[0];
            await analyzeObject(sock.user);
            info(`Bot number: ${botLid}`);
            const mentionedJids = await getTargetUser(m, true) || [];
            info(`Mentioned Jids: ${mentionedJids || "None"}`);
            const isTagged = mentionedJids.includes(`${botLid}@lid`);
            const hasDarkWord = /\bdark\b/i.test(text);
            if (isTagged || hasDarkWord) {
                const reply = await askDark(cleanId, text) || ":error: Chatbot error. Try again later...";
                return sendReply(sock, m, reply);
            }
        }
        
        if (!text.startsWith(prefix)) return;
        
        // remove prefix to get singular command
        const withoutPrefix = text.slice(prefix.length).trim().toLowerCase();
        const [cmdName, ...args] = withoutPrefix.split(/\s+/);
        
        if (!cmdName) return;
        const cmd = commands.get(cmdName) || aliases.get(cmdName);
        if (!cmd) {
            warn(`No such command: ${cmdName}`);
            await sendReply(sock, m, ":error: No such command! Baka!");
            return;
        }
        try {
            cmd.execute({
                sock,       // type: Object 
                m,          // type: Object
                args,       // type: Array 
                botName,    // type: String
                prefix,     // type: String 
                commands,   // type: Map 
                aliases     // type: Map
            })
        } catch (err) {
            error(`Error running command: ${err.stack || err.message || err}\nCommand: ${cmdName}`)
            await sendReply(sock, m, `An error occured while processing command *${cmdName}*:\n${err.stack || err.message || err}`);
            await sendReply(sock, `${master}@s.whatsapp.net`, err);
        }
        /*  Optional: Analyze each message object with the "analyzeMessage" function to understand the internal structure of baileys' messages!
            Uncomment this line to check it out:
        */
        // await analyzeObject(m);
    } catch (err) {
        error(`Error handling new messages! ${err.stack || err.message || err}`);
        await sendReply(sock, `${master}@s.whatsapp.net`, err);
    }
}
