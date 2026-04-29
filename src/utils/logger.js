// src/utils/logger.js 

import { logFile } from '../configs/paths.js';
import parseEmojis from './message/emojis.js';
import chalk from 'chalk';
import fs from 'fs-extra';

const green = chalk.green;
const blue = chalk.blue;
const yellow = chalk.yellow;
const red = chalk.red;

function writeToFile (level, msg, time) {
    let fullLog = `\n[ ${level} ] - ${msg} :: (${time})\n`;
    fullLog = parseEmojis(fullLog);
    fs.appendFileSync(logFile, fullLog);
}

export function success (msg) {
    const timeStamp = new Date().toISOString();
    writeToFile("SUCCESS", msg, timeStamp);
    const level = green(`${timeStamp} - [ SUCCESS ] ::`);
    msg = parseEmojis(`:success: ${msg}`);
    console.log(`\n${level} ${msg}\n`);
}

export function info (msg) {
    const timeStamp = new Date().toISOString();
    writeToFile("INFO", msg, timeStamp);
    const level = blue(`${timeStamp} - [ INFO ] ::`);
    msg = parseEmojis(`:info:   ${msg}`);
    console.log(`\n${level} ${msg}\n`);
}

export function warn (msg) {
    const timeStamp = new Date().toISOString();
    writeToFile("WARN", msg, timeStamp);
    const level = yellow(`${timeStamp} - [ WARN ] ::`);
    msg = parseEmojis(`:warning: ${msg}`);
    console.log(`\n${level} ${msg}\n`);
}

export function error (msg) {
    const timeStamp = new Date().toISOString();
    writeToFile("ERROR", msg, timeStamp);
    const level = red(`${timeStamp} - [ ERROR ] ::`);
    msg = parseEmojis(`:error: ${msg}`);
    console.log(`\n${level} ${msg}\n`);
}