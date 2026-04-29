// src/socket/events/connection.js 

import {
    handlePairCode,
    handleQrCode
} from '../pairing.js';
import sendReply from '../../utils/message/sendReply.js';
import { info, warn, error, success } from '../../utils/logger.js';

let reconnectInSecs = 2;
let pairCodeRequested = false;
let qrRequested = false;

export default async function handleConnUpdates (sock, update, settings) {
    const { connection, qr, lastDisconnect } = update;
    const { pairCodeLogin, phone, reconnect, isRegistered, master } = settings;
    
    if (connection === "connecting") {
        info("Bot is connecting...")
        // Request pair code 
        if (!isRegistered && pairCodeLogin && !pairCodeRequested) {
            pairCodeRequested = true;   // Do not request pair code more than once 
            qrRequested = true;    // Do not print QR while pair code is being requested. 
            const delayInSecs = 5
            info(`Requesting pairing code in ${delayInSecs}secs...`);
            try {
                setTimeout(async () => {
                    const res = await handlePairCode(sock, phone)
                    if (!res.success) {
                        warn(res.message);
                        // Fall back to qr 
                        await handleQrCode(qr);
                    } else {
                        success(res.message);
                    }
                }, delayInSecs*1000);
            } catch (err) {
                warn(`Error requesting pair code: ${err.stack || err.message || err}`);
                qrRequested = false;    // Set back to false on pair code fail. If it is still set as true, QR mode will NOT run as fallback on pair code fail.
            };
        };
    }
    
    /*
        Print QR only if and ONLY if:
          - Bot is not registered 
          - pairCodeLogin is false
          - qr string is provided by baileys
          - QR has NOT been requested previously
    */
    if (!isRegistered && !pairCodeLogin && qr && !qrRequested) await handleQrCode(qr)
    
    if (connection === "close") {
        const err = lastDisconnect?.error;
        const statusCode = err?.output?.statusCode;
        warn(`${err}`)
        warn(`Status Code: ${statusCode}`)
        if (statusCode === 401) return error("Logged out. Delete sessions folder and retry.")
        info(`Reconnecting in ${reconnectInSecs}secs...`)
        setTimeout(reconnect, reconnectInSecs*1000)
        reconnectInSecs += 4;
        if (reconnectInSecs >= 30) reconnectInSecs = 4;
    }
    
    /*
        Once bot is connected, send message to bot number dm 
    */
    if (connection === "open") {
        success("Bot is connected!");
        setTimeout(() => {
            sendReply(sock, null, `:success: Template-Bot is connected successfully!\nUse :prefix:menu to see all available commands.`, {
                jid: `${phone}@s.whatsapp.net`
            });
            sendReply(sock, `${master}@s.whatsapp.net`, ":success: Template-Bot is connected!");
        }, 5000);
    }
}