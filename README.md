# Template Bot
<p>Welcome to Template Bot `beginner` branch.</p>
<p>A clean, modular WhatsApp bot starter template built to teach proper bot architecture, scalable code structure, and beginner-friendly development.</p>
<p>No spaghetti code. No 5,000-line index.js files. No copy-paste chaos. Just readable, extendable, production-style bot development.</p>
<p>Built for developers who want to understand, not just copy-paste.</p>

## Why This Exists
Most WhatsApp bot repositories on GitHub look like this:
```js
if (command === "ping") {
   // 400 lines later...
}
```
or **worse**:
```js
// index.js
// 7,000+ lines of pain and suffering
```
That teaches beginners the wrong way to build software.
This project exists to show:
- How bots should be structured.
- Clean code.
- Modular architecture.
- Scalable systems.
- Maintainable projects.
- Not spaghetti.

## Table of Contents
- [Features](#features)
    - [Main](#main)
    - [Commands](#commands)
    - [Extra Utilities](#extra)
- [Project Structure](#project-structure)
- [Philosophy](#philosophy)
- [Feature Plans](#template-bot-feature-plans)
- [Installation](#installation)
    - [Clone The Repo](#clone-the-repo)
    - [Install Dependencies](#install-all-dependencies)
    - [Start The Bot](#start-the-bot)
- [License](#license)

## Features
### Main 
- Event-based architecture
- Clean folder structure
- Beginner-friendly code comments
- Scalable project design
- Event auto-loader
### Commands 
- Modular command handler
- Command auto-loader
- Easy command creation
- Group feature support
### Extra 
- Cooldown system
- Permissions system
- Logging system
- Production-style development workflow


## Project Structure
```
template-bot/
 |_ src/
 |   |
 |   |__ commands/
 |   |
 |   |__ configs/
 |   |
 |   |__ handlers/
 |   |
 |   |__ socket/
 |   |
 |   |__ utils/
 |   |
 |   |__ index.js
 |
 |_ package.json
 |
 |_ .env
 |
 |_ README.md
 |
 |_ .gitignore
```

## Philosophy
This repo is **NOT** for copy-paste merchants.
It is for developers who want to learn:
- why code is structured this way
- how real projects scale
- how to add features without breaking everything
- how maintainable bots are actually built

If you want **instant bot glory** with *zero understanding*—
***this is not your repo***.

### Beginner Rule
1. Every file should teach, not just work.
2. Every important function is explained.
3. Every module exists for a reason.
4. This project is designed to help beginners understand architecture, not just run commands.

Because understanding > copying. **Always**.
#### Example
Instead of this:
```js
if (command === "ping") {
   reply("pong");
};
```
we do this:
```js
const command = commands.get(cmd);
if (command) command.execute();
```
Because scalable code matters. 

## Template Bot Feature Plans
| Feature | Status | Branch |
| --- | --- | --- |
| Command Handler | ✓ | beginner |
| Event Loader | ✓ | beginner |
| Welcome / Goodbye System | x | beginner |
| Dashboard | x | advanced |
| Anti-link System | x | advanced |
| Anti-spam System | x | advanced |
| Dashboard Support | x | advanced |
| Plugin Support | x | senior |
| Middleware System | x | senior |
| Full Database Integration | x | senior |

This is a foundation.
**Build on it**.

## Installation
### Clone The Repo 
```bash
git clone https://github.com/darkid15/template-bot.git
```
### Install All Dependencies
```bash
cd Template-Bot
npm install
```
### Start the bot 
```bash
npm start
```
All together:
```bash
git clone https://github.com/darkid15/template-bot.git
cd Template-Bot
npm install
npm start
```
### Contributing?
Good architecture only.
No spaghetti PRs.
If your code adds 600 lines to one file, we fight.
Respectfully.

### Final Words
Stop building bots that collapse when one command breaks.
Build systems.
Build structure.
Build things that last.
That is what this project is for.

## License
MIT License. More info in the [LICENSE](./LICENSE) file.

Use it.

Learn from it.

Improve it.

Teach others.

And please—

stop uploading *8,000-line index.js* files to GitHub.

> If this repo helped you, then give it a star ⭐!