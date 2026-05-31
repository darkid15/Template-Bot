// src/socket/index.js 

import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from 'baileys';
import useSqlJsAuthState from "../auth-state.js"

import fs from 'fs-extra';
import PINO from 'pino';
import { info, success } from '../utils/logger.js';

export default async function createSocket (authFolder, user='default') {
    info(":plug: Creating socket...");
    /*  First, make sure the sessions folder exists
        Using the regular fs module, it looks like:
        if (!fs.existsSync(authFolder)) {
            fs.mkDirSync(authFolder)
        };
    */
    // Using fs-extra 
    fs.ensureDir(authFolder)    // Creates `~/Template-Bot/auth` (or your auth file name) 
	const session = `${authFolder}/usr-${user}-session.db`;
    const { state, saveCreds } = await useSqlJsAuthState(session, user);
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
    
    sock.ev.on("creds.update", saveCreds);  // Save creds else you'll have to re-pair
    success(":plug: Created socket successfully!");
    
    return sock;
}
