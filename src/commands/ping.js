// src/commands/ping.js 

import os from 'os';
import sendReply from '../utils/message/sendReply.js';
import { error } from '../utils/logger.js';

export default {
    name: "ping",
    category: "system",
    desc: "Measure bot latency and display system info",
    usage: ":prefix:ping",
    aliases: ["status", "alive"],
    execute: async ({ sock, m, botName }) => {
        try {
            const start = Date.now();
            
            await sendReply(sock, m, ":ping: Pinging...")
            
            const latency = Date.now() - start;
            
            // Optional system info
            const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const uptime = (process.uptime() / 60).toFixed(2); // in minutes
            const cpuInfo = os.cpus();
            const cpuModel = cpuInfo?.[0]?.model || os.arch() || "Unknown Device";
    
            const replyText = `:ping: Pong! ${botName} is alive!\n\n` +
                `• :wifi: Latency: ${latency}ms\n` +
                `• :cycle: Uptime: ${uptime} minutes\n` +
                `• :brain: Memory Usage: ${memoryUsage} MB\n` + 
                `• :laptop: CPU: ${cpuModel}`;
            
            return sendReply(sock, m, replyText);
        } catch (err) {
            await sendReply(sock, m, ":error: An error occured while fetching ping info.");
            error(`Error fetching ping info: ${err.stack || err.message || err}`);
            return;
        }
    }
}