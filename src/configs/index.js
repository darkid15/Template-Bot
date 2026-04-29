// src/configs/index.js 

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const botName = process.env.BOT_NAME || "Template Bot";
export const prefix = process.env.BOT_PREFIX || "/";