// src/index.js

import createSocket from './socket/index.js';
import handleSocketEvents from './socket/events/index.js'
import { info, error } from './utils/logger.js';
import { 
    BOT_NAME,
    BOT_PHONE,
    MASTER_PHONE 
} from './configs/index.js';

async function startBot () {
    try {
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
            master: MASTER_PHONE || BOT_PHONE
        });
        if (sock) info(JSON.stringify(sock))
    } catch (err) {
        error(`Error starting ${BOT_NAME}: ${err.stack || err.message || err}`)
        process.exit(1)
    }
}

startBot()
process.stdin.resume();
