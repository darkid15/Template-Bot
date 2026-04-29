// src/handlers/participants.js 

import sendReply from '../utils/message/sendReply.js';
import analyzeObject from '../utils/message/analyze.js';
import { info, warn, error } from '../utils/logger.js';

export default async function handleParticipantUpdates (sock, data, settings) {
    const { master } = settings;
    try {
        // group jid, array of users, add/remove/promote/demote
        const { id, participants, action } = data;

        for (const p of participants){
            const userId = p.id || p.phoneNumber;
            const cleanId = userId.split("@")[0];
            switch (action) {
                case "add":
                    sendReply(sock, id, {
                        text: `Hello, @${cleanId}! Glad to have you here.`,
                        mentions: [userId]
                    });
                    break;
    
                case "remove":
                    sendReply(sock, id, {
                        text: `:wave: Sayonarra, @${cleanId}\nHope we meet again.`,
                        mentions: [userId]
                    });
                    break;
    
                case "promote":
                    sendReply(sock, id, {
                        text: `A fish rises to a dragon! @${cleanId}`,
                        mentions: [userId]
                    });
                    break;
    
                case "demote":
                    sendReply(sock, id, {
                        text: `Oof! A demotion. @${cleanId}, maybe next time do your job right or something idrk`,
                        mentions: [userId]
                    });
                    break;
    
                default:
                    warn(`Unknown participant action: ${action}`);
            }
            // await analyzeObject(data);
        }

    } catch (err) {
        error(`Participant update error:\n${err.stack || err.message || err}`);
        await sendReply(sock, `${master}@s.whatsapp.net`, err);
    };
}