// src/socket/pairing.js 

import qrcode from 'qrcode-terminal';

export async function handlePairCode (sock, phone) {
    let message;
    if (!phone) return {
        success: false,
        message: "No phone number provided!"
    }
    try{
        const code = await sock.requestPairingCode(phone, "TMPLTBOT");
        message = `${"=".repeat(20)}
   Requested pair code for ${phone}!
   Your Pair Code: ${code || "No Pair Code Generated"}
${"=".repeat(20)}\n`;
        return {
            success: true,
            message: message
        }
    } catch (err){
        message = `Error reqesting pair code: ${err.message || err.stack || err}\nNow using QR code login as fallback...`
        return {
            success: false,
            message: message
        }
    }
}

export async function handleQrCode (qr) {
    try {
        console.log(`\n${"=".repeat(40)}\n   Scan this qr to connect the bot`)
        await qrcode.generate(qr, { small: true})
    } catch (err) {
        throw new Error(`Error generating QR login code: ${err.message || err.stack || err}`)
    }
}