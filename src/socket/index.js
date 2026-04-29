// src/socket/index.js 

import makeWASocket, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from 'baileys';
import fs from 'fs-extra';
import PINO from 'pino';
import { info, success } from '../utils/logger.js';

export default async function createSocket (authFolder) {
    info("Creating socket...");
    /*  First, make sure the sessions folder exists
        Using the regular fs module, it looks like:
        if (!fs.existsSync(authFolder)) {
            fs.mkDirSync(authFolder)
        };
    */
    // Using fs-extra 
    fs.ensureDir(authFolder)    // Creates the directory if it doesn't exist, does nothing if it does. 
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();
    
    // Create the actual socket 
    const sock = makeWASocket({
        version,
        auth: state,
        logger: PINO({ level: "silent" }),
        printQRInTerminal: false,    // Handle qr rendering yourself. Baileys' qr renderer is deprecated
        markOnlineOnConnect: true
    })
    
    sock.ev.on("creds.update", saveCreds);  // IMPORTANT!!! If you do not save creds, you will have to repair your bot each time the bot restarts
    success("Created socket successfully!");
    
    return sock;
}
