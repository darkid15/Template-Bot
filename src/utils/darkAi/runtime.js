// src/utils/darkAi/runtime.js 

import { darkFile } from '../../configs/paths.js';
import { writeJSON, readJSON } from '../json.js'
import { success, error } from '../logger.js';

export async function setAiConfigs () {
    try {
        const defData = { active: "false" };
        await writeJSON(darkFile, defData);
        success("Set ai configs!");
        return;
    } catch (err) {
        error(`Error loading ai configs: ${err.stack || err.message || err}`);
    }
}

export async function getAiConfigs () {
    try {
        const defData = { active: "false" };
        const botData = await readJSON(darkFile, defData)
        return botData;
    } catch (err) {
        error(`Error getting AI configs: ${err.stack || err.message || err}`);
    }
}