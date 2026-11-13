// src/utils/logger.js 

import { logFolder } from '../configs/paths.js';
import parseEmojis from './message/emojis.js';
import chalk from 'chalk';
import fs from 'fs-extra';

const green = chalk.green;
const blue = chalk.blue;
const yellow = chalk.yellow;
const red = chalk.red;

export default function createLogger (user) {
	fs.ensureDirSync(logFolder);
	const logFile = `${logFolder}/usr-${user}.log`;
	function writeToFile (level, msg, time) {
	    let fullLog = `\n[ ${level} ] :: [ ${user} ] - ${msg} :: (${time})\n`;
	    fullLog = parseEmojis(fullLog);
	    fs.appendFileSync(logFile, fullLog);
	}

    function log (level, color, msg) {
        const timeStamp = new Date().toISOString();
        writeToFile(level, msg, timeStamp);
        const logLvl = color(`${timeStamp} - [ ${level} ] ::`);
    
        msg = parseEmojis(`:${level.toLowerCase()}: ${msg}`);
        console.log(`\n${logLvl} [ ${user} ] ${msg}\n`);
    }
	
	const info = (msg) => log("INFO", blue, msg);
    const success = (msg) => log("SUCCESS", green, msg);
    const warn = (msg) => log("WARNING", yellow, msg);
    const error = (msg) => log("ERROR", red, msg);

	return { info, success, warn, error}
}