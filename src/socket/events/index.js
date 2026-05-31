// src/socket/events/index.js 

import handleConnUpdates from './connection.js';
import handleMsgUpdates from './messages.js';
import handleGroupEvents from './groups.js';
import loadCommands from '../../utils/commandsLoader.js';
import { info } from '../../utils/logger.js';

export default async function handleSocketEvents (sock, settings) {
    // Load commands and alias maps 
    const commands = await loadCommands();
     
    // Handles connection updates. Here, you recieve qr amd pair codes essential for first-time login
    sock.ev.on("connection.update", async (update) => {
        await handleConnUpdates(sock, update, settings)
    });
    
    // Handles incoming messages from users.
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        await handleMsgUpdates(sock, messages, type, commands, settings);
    });
    
    // Due to the nature of group events (multip) 
    if (settings.isRegistered) {
        handleGroupEvents(sock, settings);
    }
    // Other events like status update events handled in different helper functions here 
}
