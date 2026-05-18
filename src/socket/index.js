// src/socket/index.js 

import makeWASocket, { fetchLatestBaileysVersion } from 'baileys';
import useSqliteAuthState from "../auth-state.js"

import fs from 'fs-extra';
import PINO from 'pino';
import { info, success } from '../utils/logger.js';

export default async function createSocket (authFolder) {
    info(":plug: Creating socket...");
    /*  First, make sure the sessions folder exists
        Using the regular fs module, it looks like:
        if (!fs.existsSync(authFolder)) {
            fs.mkDirSync(authFolder)
        };
    */
    // Using fs-extra 
    fs.ensureDir(authFolder)    // Creates `~/Template-Bot/auth` (or your auth file name) 
    const { state, saveCreds } = await useSqliteAuthState(`${authFolder}/auth.db`);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    info(`:laptop: Running baileys version v${version} :: Is latest version: ${isLatest}`);
    
    // Create the actual socket 
    const sock = makeWASocket({
        version,
        auth: state,
        logger: PINO({ level: "silent" }),
        printQRInTerminal: false,    // Handle qr rendering yourself. Baileys' qr renderer is deprecated
        markOnlineOnConnect: true
    })
    
    sock.ev.on("creds.update", saveCreds);  // IMPORTANT!!! If you do not save creds, you will have to repair your bot each time the bot restarts
    success(":plug: Created socket successfully!");
    
    return sock;
}
