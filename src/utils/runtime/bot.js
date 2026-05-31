// src/utils/runtime/bot.js

import {
    readJSON,
    writeJSON
} from '../json.js';
import { info, warn } from '../logger.js';
import { botData } from '../../configs/paths.js';
import dotenv from 'dotenv';
dotenv.config();

const botPhone = process.env.BOT_PHONE || ""
const masterPhone = process.env.MASTER_PHONE || botPhone || "";

const defaultBotData = {
    self: {
        name: "Template Bot",
        prefix: "!",
        phone: botPhone,
        jid: botPhone ? `${botPhone}@s.whatsapp.net` : "",
        lid: ""
    },

    master: {
        phone: masterPhone,
        jid: masterPhone ? `${masterPhone}@s.whatsapp.net` : "",
        lid: ""
    }
};

// Cache
let cachedConfig = null;

export default async function getBotConfigs() {
    // Return cache if already loaded
    if (cachedConfig) {
        return cachedConfig;
    }

    // Read config
    let config = await readJSON(botData, null);

    // First startup → create config file
    if (!config) {
        config = defaultBotData;
        await writeJSON(botData, config);
        info(":success: Created bot config file.");
    }

    // Cache config
    cachedConfig = config;
    return config;
}

// Optional cache reset
export function refreshBotConfigs() {
    cachedConfig = null;
}