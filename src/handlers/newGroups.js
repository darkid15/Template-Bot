// src/socket/events/groups/newGroups.js

import sendReply from '../utils/message/sendReply.js';
import analyzeObject from '../utils/message/analyze.js';
import { info, warn } from '../utils/logger.js';

/*
Handles:
groups.upsert

Useful for:
- bot added to new group
- initialize default settings
- setup welcome configs
*/

export default async function handleCreated(sock, groups, settings) {
    const { master } = settings;
    let message;
    try {
        for (const group of groups) {
            info("New Group Detected");

            const { id, subject, desc, participants, owner } = group;

            message = `:wave: Hi! Thanks for adding me!
> • :group: ${subject || "No name!"} 

${desc || ":error: No description."}

:group: ${participants.length || 0} members
:admin: Super Admin: @${owner.split("@")[0]}`;
            sendReply(sock, id, {
                text: message,
                mentions: [owner]
            });

            /*
            Example future logic:

            - save group to database
            - set default configs
            - enable welcome system
            - initialize RPG profile
            */
            
            // Analyze group object 
            // await analyzeObject(group);
        }

    } catch (err) {
        warn(`Group creation error: ${err.stack || err.message || err}`);
        await sendReply(sock, `${master}@s.whatsapp.net`, err);
    }
}