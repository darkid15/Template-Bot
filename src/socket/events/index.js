// src/socket/events/index.js 

import handleConnUpdates from './connection.js';
import handleMsgUpdates from './messages.js';
import handleGroupEvents from './groups.js';
import loadCommands from '../../utils/commandsLoader.js';
import { info } from '../../utils/logger.js';

export default async function handleSocketEvents (sock, settings) {
    // Load commands 
    const { commands, aliases } = await loadCommands();
    /*  
    Handles connection updates. Here, you recieve qr amd pair codes essential for first-time logins
    */
    sock.ev.on("connection.update", async (update) => {
        info("Handling connection updates...")
        await handleConnUpdates(sock, update, settings)
    });
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        info("Handling message updates...")
        await handleMsgUpdates(sock, messages, type, {
            commands,
            aliases
        }, settings);
    });
    
    /* 
        Due to the nature of group events (multip)
    */
    info("Handling Group Events...")
    handleGroupEvents(sock, settings)
    // Other events like status update events handled in different helper functions here 
}
