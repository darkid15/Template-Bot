// src/configs/index.js 

import path from 'path';
import { fileURLToPath } from 'url';
import getBotConfigs from '../utils/runtime/bot.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const getBotCfgs = async () => {
    const cfg = await getBotConfigs()
    return cfg;
}

export const botName = process.env.BOT_NAME || "Template Bot";
export const prefix = process.env.BOT_PREFIX || "/";
export const botPhone = process.env.BOT_PHONE || process.env.MASTER_PHONE || null;

export const masterPhone = process.env.MASTER_PHONE || null;

export const roles = {
    master: process.env.MASTER_PHONE,
    owner: process.env.OWNER_PHONE,
    officers: process.env.OFFICERS
        ? process.env.OFFICERS.split(",")
        : []
}
