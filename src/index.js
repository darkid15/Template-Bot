// src/index.js

import createSocket from './socket/index.js';
import handleSocketEvents from './socket/events/index.js'
import createLogger from './utils/logger.js';
import { getBotCfgs } from './configs/index.js';

async function startBot (user='default') {
    let botName = "Template-Bot";
	// Create user sensitive logger instance 
	const logger = await createLogger(user);
	const bot = await getBotCfgs(logger);
    botName = bot?.self?.name;
    try {
        logger.info(`Starting ${botName} for ${user} user...`)
        const sock = await createSocket("auth", logger, user);    // Creates a folder in the project root directory named "auth". 

        /*
          Handles socket events:
            - sock.ev.on("connection.update", ()=>{...}) 
            - sock.ev.on("messages.upsert", ()=>{...})  
        */
        await handleSocketEvents(sock, {
            pairCodeLogin: true,
            reconnect: startBot,
			user,
            bot, 
			logger 
        });
    } catch (err) {
        logger.error(`:exclaim2: Error starting ${botName}: ${err.stack || err.message || err}`)
        process.exit(1)
    }
}

const users = ['default', 'darkid'];

for (const user of users) {
	startBot(user)
	process.stdin.resume();
}
