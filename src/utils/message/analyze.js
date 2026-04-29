// src/utils/message/analyzeMsgobj..js 

import { info } from '../logger.js';

export default function analyzeObject(myObj) {
    info("=== OBJECT BREAKDOWN ===");

    if (myObj?.key && myObj?.message) {
        info(`Type: ${Object.keys(myObj.message || {})}`);
        info(`Sender: ${myObj.key.participant || myObj.key.remoteJid}`);
        info(`Push Name: ${myObj.pushName}`);
    };

    // info(`Full Object: ${console.dir(myObj, { depth: null })}`);
    info(`Full Object: ${JSON.stringify(myObj, null, 4)}`);
}