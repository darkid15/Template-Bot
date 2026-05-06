// src/configs/index.js 

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const botName = process.env.BOT_NAME || "Template Bot";
export const prefix = process.env.BOT_PREFIX || "/";
export const BOT_PHONE = process.env.BOT_PHONE || process.env.MASTER_PHONE || null;

export const MASTER_PHONE = process.env.MASTER_PHONE || null;

export const roles = {
    master: process.env.MASTER_PHONE,
    owner: process.env.OWNER_PHONE,
    officers: process.env.OFFICERS
        ? process.env.OFFICERS.split(",")
        : []
}
