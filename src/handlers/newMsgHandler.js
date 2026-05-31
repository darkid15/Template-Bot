// src/handlers/newMsgHandler.js 

import extractText from '../utils/message/extractText.js'
import analyzeObject from '../utils/message/analyze.js';
import sendReply from '../utils/message/sendReply.js';
import { info, warn, error } from '../utils/logger.js';
import { readJSON } from '../utils/json.js';

export default async function handleNewMessages (sock, m, cmds, bot) {
    const { commands, aliases } = cmds;
    
    const BOT = bot?.self;
    const prefix = BOT.prefix || "!";
    const botName = BOT.name;
    const master = bot?.master?.phone;
    
    const userId = m.key.participant || m.key.remoteJid;
    const cleanId = userId?.split("@")[0] || "unknown";
    try {
        if (!m.message) return warn(":trashCan: No message object detected!");
        // extract text 
        const text = await extractText(m);
        if (!text) return;
        if (!text.startsWith(prefix)) return;
        
        // remove prefix to get singular command
        const withoutPrefix = text.slice(prefix.length).trim().toLowerCase();
        const [cmdName, ...args] = withoutPrefix.split(/\s+/);
        
        if (!cmdName) return;
        const cmd = commands.get(cmdName) || aliases.get(cmdName);
        if (!cmd) return;
        try {
            cmd.execute({
                sock,       // type: Object 
                m,          // type: Object
                args,       // type: Array 
                bot,        // type: Object
                commands,   // type: Map 
                aliases     // type: Map
            })
        } catch (err) {
            error(`Error running command: ${err.stack || err.message || err}\nCommand: ${cmdName}`)
        }
        /*  Optional: Analyze each message object with the "analyzeMessage" function to understand the internal structure of baileys' messages!
            Uncomment this line to check it out:
        */
        // await analyzeObject(m);
    } catch (err) {
        error(`Error handling new messages! ${err.stack || err.message || err}`);
    }
}
