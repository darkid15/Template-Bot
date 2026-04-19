# Template Bot
A clean, modular WhatsApp bot starter template built to teach proper bot architecture, scalable code structure, and beginner-friendly development.
No spaghetti code.
No 5,000-line index.js files.
No copy-paste chaos.
Just readable, extendable, production-style bot development.
Built for developers who want to understand, not just copy-paste.

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
- This is how bots should be structured.
- Clean code.
- Modular architecture.
- Scalable systems.
- Maintainable projects.
- Not spaghetti.

## Features
- Modular command handler
- Event-based architecture
- Command auto-loader
- Event auto-loader
- Clean folder structure
- Beginner-friendly code comments
- Scalable project design
- Easy command creation
- Group feature support
- Cooldown system
- Permissions system
- Logging system
- Extendable database support
- Production-style development workflow

## Project Structure
```bash
template-bot/
│
├── src/
│   │
│   ├── core/
│   │   ├── client.js
│   │   ├── loader.js
│   │   ├── handler.js
│   │   └── logger.js
│   │
│   ├── commands/
│   │   ├── general/
│   │   │   ├── ping.js
│   │   │   └── help.js
│   │   │
│   │   ├── owner/
│   │   │   └── eval.js
│   │   │
│   │   └── fun/
│   │       └── meme.js
│   │
│   ├── events/
│   │   ├── messages.upsert.js
│   │   ├── group-participants.update.js
│   │   └── connection.update.js
│   │
│   ├── utils/
│   │   ├── prefix.js
│   │   ├── parser.js
│   │   ├── formatter.js
│   │   └── cooldown.js
│   │
│   ├── config/
│   │   └── settings.js
│   │
│   ├── database/
│   │   └── db.js
│   │
│   └── index.js
│
├── package.json
├── .env
├── README.md
└── .gitignore
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

## Beginner Rule
Every file should teach.
Not just work.
Every important function is explained.
Every module exists for a reason.
This project is designed to help beginners understand architecture, not just run commands.
Because understanding > copying.
Always.
### Example
Instead of this:
```js
if (command === "ping") {
   reply("pong")
}
```
we do this:
```js
const command = commands.get(cmd)
if (command) command.run()
```
Because scalable code matters.

## Future Plans
Welcome / Goodbye system
Anti-link system
Anti-spam system
Economy system
Plugin support
Hot reload
Middleware system
Advanced permissions
Dashboard support
Full database integration
This is a foundation.
**Build on it**.
## Installation
```bash
git clone https://github.com/yourusername/template-bot.git
cd template-bot
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

### License
MIT License
Use it.
Learn from it.
Improve it.
Teach others.
And please—
stop uploading *8,000-line index.js* files to GitHub.

> If this repo helped you, then give it a star ⭐!