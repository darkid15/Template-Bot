// src/socket/events/connection.js 

import {
    handlePairCode,
    handleQrCode
} from '../pairing.js';
import sendReply from '../../utils/message/sendReply.js';
import { info, warn, error, success } from '../../utils/logger.js';
import { sleep } from "../../utils/utils.js";


let reconnectInSecs = 2;
let pairCodeRequested = false;
let qrRequested = false;
let isProcessing = false;
let latestQr = null

export default async function handleConnUpdates (sock, update, settings) {
    try {
        //if (isProcessing) return // warn("Conn handling in process!");
        //isProcessing = true;
        info(":internet: Handling connection updates...")
        const { connection, qr, lastDisconnect } = update;
        const { pairCodeLogin, reconnect, bot } = settings;
        const isRegistered = sock.authState?.creds?.registered || false;

        if (qr) latestQr = qr;

        const BOT = bot.self;
        const phone = BOT.phone || "";
        const botName = BOT.name;
        const prefix = BOT.prefix || "!";
        const master = bot?.master?.phone || "";
    
        if (!isRegistered && pairCodeLogin && !pairCodeRequested) {
            info(":robot: Bot is connecting...")
            // Request pair code 
            pairCodeRequested = true;   // Do not request pair code more than once 
            // qrRequested = true;    // Do not print QR while pair code is being requested. 
            const delayInSecs = 8;
            info(`:phone: Requesting pairing code in ${delayInSecs}secs...`);
            try {
                setTimeout(async () => {
                    const res = await handlePairCode(sock, phone)
                    if (!res.success) {
                        warn(res.message);
                        // Fall back to qr 
                        await sleep(5);
                        if (latestQr) {
                            qrRequested = true;
                            await handleQrCode(latestQr);
                        } else {
                            warn("QR not received yet. Waiting for next update...");
                        }
                    } else {
                        success(res.message);
                    }
                }, delayInSecs*1000);
            } catch (err) {
                warn(`:error: Error requesting pair code: ${err.stack || err.message || err}`);
                qrRequested = false;    // Set back to false on pair code fail. If it is still set as true, QR mode will NOT run as fallback on pair code fail.
            };
        };
        
        /*
            Print QR only if and ONLY if:
              - Bot is not registered 
              - pairCodeLogin is false
              - qr string is provided by baileys
              - QR has NOT been requested previously
        */
        if (qr) {
            latestQr = qr;
            if (!isRegistered && !qrRequested) {
                qrRequested = true;
                await handleQrCode(qr)
            }
        }
        
        if (connection === "close") {
            pairCodeRequested = false;
            qrRequested = false;
            latestQr = null;
            const err = lastDisconnect?.error;
            const statusCode = err?.output?.statusCode;
            warn(`:error: ${err}`)
            warn(`Status Code: ${statusCode}`)
            if (statusCode === 401) return error(":trashCan: Logged out. Delete sessions folder and retry.")
            info(`:cycle: Reconnecting in ${reconnectInSecs}secs...`)
            setTimeout(reconnect, reconnectInSecs*1000)
            reconnectInSecs += 4;
            if (reconnectInSecs >= 30) reconnectInSecs = 4;
        }
        
        /*
            Once bot is connected, send message to bot number dm 
        */
        if (connection === "open") {
            success(":robot: Bot is connected!");
            reconnectInSecs = 4;
            setTimeout(() => {
                sendReply(sock, `${master}@s.whatsapp.net`, `Connection Status: Stable :greenBall:
:success: *${botName}* is connected _successfully_!

:scroll: Use \`${prefix}menu\` to see all available commands. :scroll:
:gear: *${botName.toUpperCase()} CONFIGS* :gear:
• :id: Bot Name: [ *${botName}* ]
• :gear: Prefix: [ *${prefix}* ]
• :phone: Bot Phone: [ *${phone}* ]
• :phone: Master Phone: [ *${master}* ]`);
            }, 5000);
        }
    } catch (err) {
        error(`:exclaim2: Connection handler error: ${err.stack || err.message || err}`);
        process.exit(1);
    } finally {
        isProcessing = false;
    }
}
