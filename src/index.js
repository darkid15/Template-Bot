// src/index.js

import createSocket from './socket/index.js';
import handleSocketEvents from './socket/events/index.js'
import { info, error } from './utils/logger.js';
import { getBotCfgs } from './configs/index.js';

async function startBot () {
    let botName = "Template-Bot";
	const bot = await getBotCfgs();
    botName = bot?.self?.name;
    try {
        info(`Starting ${botName}...`)
        const sock = await createSocket("auth");    // Creates a folder in the project root directory named "auth". 
        
        const isRegistered = sock.authState.creds.registered;
        /*
          Handles socket events:
            - sock.ev.on("connection.update", ()=>{...}) 
            - sock.ev.on("messages.upsert", ()=>{...})  
        */
        await handleSocketEvents(sock, {
            pairCodeLogin: true,
            reconnect: startBot,
            bot 
        });
    } catch (err) {
        error(`:exclaim2: Error starting ${botName}: ${err.stack || err.message || err}`)
        process.exit(1)
    }
}

startBot()
process.stdin.resume();
