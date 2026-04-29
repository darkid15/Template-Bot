// src/utils/runtime/index.js 

import {
    input, 
    close, 
    print, 
    sleep
} from '../utils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import getBotConfigs from './getBotConfigs.js';

export default async function startup () {
    const flags = process.argv.slice(2);
    return {
        pairCodeLogin: flags.includes("--pair-code"),
        phone: process.env.PHONE || null,
        
    }
}

startup();