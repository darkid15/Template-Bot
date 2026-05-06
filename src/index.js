// src/index.js

import createSocket from './socket/index.js';
import handleSocketEvents from './socket/events/index.js'
import { info } from './utils/logger.js';
import { 
    BOT_PHONE,
    MASTER_PHONE 
} from './configs/index.js';

async function startBot () {
    info("Starting Template Bot...")
    const sock = await createSocket("auth");    // Creates a folder in the project root directory named "auth". 
    
    const isRegistered = sock.authState.creds.registered;
    
    /*
        Handles socket events:
          - sock.ev.on("connection.update", ()=>{...}) 
          - sock.ev.on("messages.upsert", ()=>{...})  
    */
    await handleSocketEvents(sock, {
        pairCodeLogin: true,
        phone: BOT_PHONE || null,
        reconnect: startBot,
        isRegistered: isRegistered,
        master: MASTER_PHONE
    });
}

startBot()
process.stdin.resume();