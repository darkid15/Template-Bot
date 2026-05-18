// src/socket/events/groups.js 

import handleParticipantUpdates from '../../handlers/participants.js';
import handleNewGroups from '../../handlers/newGroups.js';
import { warn, info } from '../../utils/logger.js';

export default async function handleGroupEvents (sock, settings) {
    if (!sock?.user) return;
    info(":group: Handling Group Events...")
    sock.ev.on("group-participants.update", async (data) => {
        await handleParticipantUpdates(sock, data, settings);
    });
    
    // Bot gets added to a new group
    sock.ev.on("groups.upsert", async (data) => {
        await handleNewGroups(sock, data, settings);
    });
} 
