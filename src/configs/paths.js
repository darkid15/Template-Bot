// src/configs/paths.js 

import path from 'path';
import { __dirname } from './index.js';

export const home = path.join(__dirname, "..", "..");
export const src = path.join(__dirname, "..");
export const cmdDir = path.join(src, "commands");
export const configDir = path.join(src, "configs");
export const dataDir = path.join(src, "data");
export const utilsDir = path.join(src, "utils");
export const assetsDir = path.join(src, "assets");

export const logFile = path.join(dataDir, ".log");
