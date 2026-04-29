// src/commands/menu.js 

import sendReply from '../utils/message/sendReply.js';
import { error } from '../utils/logger.js';

export default {
    name: "menu",
    category: "system",
    desc: "Show all available commands.",
    usage: ":prefix:menu",
    aliases: [],
    execute: async ({ sock, m, commands, botName, prefix }) => {
        try {
            let count;
            const userId = m.key.participant || m.key.remoteJid;
            const cleanId = userId.split("@")[0];
            
            const groups = { };
            for (const c of commands.values()) {
                if (c.hidden) continue;
                if (!groups[c.category]) groups[c.category] = [];
                groups[c.category].push(c);
                count++;
            }
            const bottomBar ="|----------------------------"
            
            let menuText = `${"-".repeat(10)}{ ${botName} }${"-".repeat(10)}
|${"-".repeat(35)}|
•--- \`${botName.toUpperCase()} BOT MENU\`
| Hello, @${cleanId}!
| Prefix: [ *${prefix}* ]
${bottomBar}
`
            
            for (const category in groups) {
                menuText += `| _${category}_\n`;
                for (const cmd of groups[category]) {
                    menuText += `|    *${cmd.name}*\n|  |    _${cmd.desc}_\n`;
                }
                menuText += `|  ${bottomBar}\n${bottomBar}\n\n`;
            }
            
            menuText += `
Thank you for using ${botName}, @${cleanId}!
        
*Bot Version*: *1.0.0*`;
            
            await sendReply(sock, m, {
                text: menuText,
                mentions: [userId]
            });
        } catch (err) {
            error(`Error running menu command: ${err.stack || err.message || err}`);
        }
    }
}