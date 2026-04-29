// src/index.js

import createSocket from './socket/index.js';
import handleSocketEvents from './socket/events/index.js'
import { setAiConfigs, getAiConfigs } from './utils/darkAi/runtime.js';
import { info } from './utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const masterPhone = process.env.MASTER_PHONE;

async function startBot () {
    info("Starting Template Bot...")
    const sock = await createSocket("auth");
    
    // Initialize ai configs
    const isRegistered = sock.authState.creds.registered;
    if (!isRegistered) await setAiConfigs();
    await handleSocketEvents(sock, {
        pairCodeLogin: true,
        phone: process.env.PHONE || null,
        reconnect: startBot,
        isRegistered: isRegistered,
        master: masterPhone
    });
}

startBot()
process.stdin.resume();