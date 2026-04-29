// src/utils/message/tags.js 

import { getContentType } from 'baileys';

/**
 * Extracts contextInfo safely from any message type
 */
function getContextInfo(msg) {
    const message = msg.message;
    if (!message) return null;

    const type = getContentType(message);
    return message[type]?.contextInfo || null;
}

/**
 * Gets target user (mention or reply)
 */
export function getTargetUser (msg, returnFullArray=false) {
    const context = getContextInfo(msg);
    if (!context) return null;
    
    if (returnFullArray) {
        if (context?.quotedMessage) {
            return [context.participant, ...context.mentionedJid];
        }
        return context?.mentionedJid
    };

    // Priority 1: Reply (swipe right)
    if (context?.quotedMessage) return context.participant;
    // Priority 2: Mention 
    if (context.mentionedJid?.length) return context.mentionedJid[0];

    return null;
}

/**
 * Checks if user tagged anyone
 */
export function hasTargetUser(msg) {
    return getTargetUser(msg) !== null;
}

export function getQuotedMsg(msg) {
    const ctx = getContextInfo(msg);
    const quoted = ctx?.quotedMessage;
    if (!quoted) return null;
    return {
        success: true,
        quoted: ctx?.quotedMessage
    }
}
