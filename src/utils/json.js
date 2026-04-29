// src/utils/json.js

import fs from 'fs-extra';
import { error } from './logger.js';

/**
 * Read JSON file safely
 * @param {string} filePath
 * @param {object} defaultValue - returned if file doesn't exist or fails
 */
export async function readJSON(filePath, defaultValue = {}) {
    try {
        const exists = await fs.pathExists(filePath);
        if (!exists) return defaultValue;

        const data = await fs.readJson(filePath);
        return data;
    } catch (err) {
        error(`Error reading JSON: ${filePath}\n`, err);
        return defaultValue;
    }
}

/**
 * Write JSON file safely
 * @param {string} filePath
 * @param {object} data
 */
export async function writeJSON(filePath, data) {
    try {
        await fs.ensureFile(filePath); // creates file + folders if needed
        await fs.writeJson(filePath, data, { spaces: 4 });
        return true;
    } catch (err) {
        error(`Error writing JSON: ${filePath}\n`, err);
        return false;
    }
}

/**
 * Update JSON file (read → modify → write)
 * @param {string} filePath
 * @param {(data: object) => object} updater
 */
export async function updateJSON(filePath, updater) {
    try {
        const current = await readJSON(filePath, {});
        const updated = await updater(current) || current;

        await writeJSON(filePath, updated);
        return updated;
    } catch (err) {
        error(`Error updating JSON: ${filePath}\n`, err);
        return null;
    }
}
