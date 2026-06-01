// src/utils/message/extractText.js 

import { getContentType } from 'baileys';

export default function extractText (m) {
    const contentType = getContentType(m.message);
    const content = m.message[contentType];
    try {
        switch (contentType) {
            case "conversation":
                return content;
            case "extendedTextMessage":
                return content.text;
            case "imageMessage":
            case "videoMessage":
            case "documentMessage":
                return content.caption || "";
        }
    } catch (err) {
        console.error(`Error extracting text: ${err.stack || err}`)
    }
}
