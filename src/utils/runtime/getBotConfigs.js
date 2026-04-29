// src/utils/runtime/getBotConfigs.js 
import {
    input, 
    close, 
    print, 
    sleep
} from '../utils.js';

export default async function start() {
    print(`Collecting bot configs. These include the bot's name, prefix and bot number and one owner number.
You could always change these anytime, with the exception of the bot's number and the owner number.`)
    await sleep(1.5);
    const botName = await input("Bot's name: ");
    const prefix = await input("Bot's prefix: ");
    await sleep(1)
    print(`Type the bot number and owner number in the following format:
Your country code, along with your phone number without the first "0".
e.g Phone: 0802xxx2037
    Type: 234802xxx2037`);
    await sleep(4);
    const ownerPhone = await input("Owner Phone: ");
    const botPhone = await input("Bot Phone: ");
    close();
    return {
        botName,
        prefix,
        ownerPhone,
        botPhone
    }
}