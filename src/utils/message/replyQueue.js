// src/utils/message/replyQueue.js

import sendReply from './sendReply.js'; 
import getHumanDelay from './humanDelay.js';

const queue = [];
let processing = false;


export default async function sendQueuedReply(sock, m, content, options={}, cooldown={ min: 2000, max: 5000 } ) {
    const delay = getHumanDelay(cooldown.min, cooldown.max);
    if (delay === null) return; // skip occasionally to simulate randomness

    queue.push({ sock, m, content, options, delay });
    await processQueue();
}

/**
 * Process the queued messages sequentially
 */
async function processQueue() {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
        const job = queue.shift();
        const jid = job.m.key.remoteJid;

        try {
            // Show "typing" presence before sending
            await job.sock.sendPresenceUpdate("composing", jid);
            await new Promise(r => setTimeout(r, 10000)) //job.delay)); // human delay

            await sendReply(job.sock, job.m, job.content, job.options);
            await job.sock.sendPresenceUpdate("paused", jid);

        } catch (err) {
            console.error(`Error sending reply: ${err.stack || err.message || err}`);
        }
    }

    processing = false;
}
