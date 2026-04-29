// src/configs/paths.js 

import path from 'path';
import { fileURLToPath } from 'url';

// These two lines calculate the absolute path to your current folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const home = path.join(__dirname, "..", "..");
export const src = path.join(__dirname, "..");
export const cmdDir = path.join(src, "commands");
export const configDir = path.join(src, "configs");
export const dataDir = path.join(src, "data");
export const utilsDir = path.join(src, "utils");
export const assetsDir = path.join(src, "assets");

export const logFile = path.join(dataDir, ".log");
export const darkFile = path.join(dataDir, "darkAi.json")