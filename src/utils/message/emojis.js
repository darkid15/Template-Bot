// src/utils/message/emojis.js 

import emojis from '../../data/emojis.json' with { type: 'json' };

export default function parseEmojis(text) {
    return text.replace(/:(\w+):/g, (match, key) => {
        return emojis[key] || match; // fallback if not found
    });
}
