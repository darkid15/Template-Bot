// src/utils/input.js

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function input (question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}
export function close () {
    rl.close();
}

export function print (text) {
    console.log(text)
}

export async function sleep (s) {
    await new Promise((resolve) => {
        setTimeout(resolve, s*1000);
    })
}