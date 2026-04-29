// src/utils/message/sendReply.js 

import fs from 'fs';
import parseEmojis from './emojis.js';
import { error } from '../logger.js';

/**
 * sendReply
 *
 * @param {object} sock - baileys socket
 * @param {object} msg - original message object
 * @param {object|string} content - message content
 * @param {object} options - additional options
 */
 
const poweredBy = "\n\n> Powered by Darkid Bots";
const isUrl = (str) => /^https?:\/\//.test(str);

export default async function sendReply(sock, msg, content, options={}) {
    try {
        let jid = msg?.key?.remoteJid || msg;
        if (options.jid) jid = options.jid;
    
        // If content is just a string convert it to text message
        if (typeof content === "string") {
            let parsed = parseEmojis(content);
            parsed += poweredBy;
            content = { text: parsed };
        } else if (content.text) {
            let parsed = parseEmojis(content.text);
            parsed += poweredBy;
            content.text = parsed;
        }
    
        // Handle local file paths automatically
        if (content.image && typeof content.image === "string") {
            if (isUrl(content.image)) content.image = { url: content.image }
            else content = fs.readFileSync(content.image)
            // Use emoji parsers for captions
            let parsed = parseEmojis(content.caption);
            parsed += poweredBy;
            content.caption = parsed;
        }
    
        if (content.video && typeof content.video === "string") {
            if (isUrl(content.video)) content.video = { url: content.video }
            else content.video =fs.readFileSync(content.video);;
            let parsed = parseEmojis(content.caption);
            parsed += poweredBy;
            content.caption = parsed;
        }
    
        if (content.audio && typeof content.audio === "string") {
            content.audio = fs.readFileSync(content.audio);
        }
    
        if (content.document && typeof content.document === "string") {
            content.document = fs.readFileSync(content.document);
        }
    
        if (content.sticker && typeof content.sticker === "string") {
            content.sticker = fs.readFileSync(content.sticker);
        }
        
        const sendOptions = { ...options };
        // only quote if msg is a real message object
        if (msg?.key) sendOptions.quoted = msg;
        
        // Send message 
        return await sock.sendMessage(
            jid,
            content,
            sendOptions
        );
    } catch (err) {
        error(`Error sending reply: ${err.stack || err.message || err}`);
    }
}
