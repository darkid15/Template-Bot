// src/socket/pairing.js 

import qrcode from 'qrcode-terminal';
import { error } from '../utils/logger.js';

export async function handlePairCode (sock, phone) {
    let message;
    if (!phone) return {
        success: false,
        message: ":error: No phone number provided!"
    }
    try{
        const code = await sock.requestPairingCode(phone, "TMPLTBOT");
        message = `${"=".repeat(20)}
   :phone: Requested pair code for ${phone}!
   :phone: Your Pair Code: ${code || "No Pair Code Generated"}
${"=".repeat(20)}\n`;
        return {
            success: true,
            message
        }
    } catch (err){
        message = `Error reqesting pair code: ${err.message || err.stack || err}\nNow using QR code login as fallback...`
        return {
            success: false,
            message
        }
    }
}

export async function handleQrCode (qr) {
    if (!qr || qr.length === 0) return error(`No qr string provided!`)
    try {
        console.log(`\n${"=".repeat(40)}\n   Scan this qr to connect the bot`)
        await qrcode.generate(qr, { small: true})
    } catch (err) {
        error(`Error generating QR login code: ${err.message || err.stack || err}`)
    }
}