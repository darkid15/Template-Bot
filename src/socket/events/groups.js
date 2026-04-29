// src/socket/events/groups.js 

import handleParticipantUpdates from '../../handlers/participants.js';
import handleNewGroups from '../../handlers/newGroups.js';

export default async function handleGroupEvents (sock, settings) {
    sock.ev.on("group-participants.update", async (data) => {
        await handleParticipantUpdates(sock, data, settings);
    });
    
    // Bot gets added to a new group
    sock.ev.on("groups.upsert", async (data) => {
        await handleNewGroups(sock, data, settings);
    });
} 
