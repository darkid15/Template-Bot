# Template Bot
A clean, modular WhatsApp bot starter template built to teach proper bot architecture, scalable code structure, and beginner-friendly development.
```js
```
No spaghetti code. No 5,000-line index.js files. No copy-paste chaos. Just readable, extendable, production-style bot development.
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

<div>
    <a href="https://manganato.com/">Click me</a>
    <img src="src/assets/logo.jpg">
</div>

## Project Structure
```
template-bot/
 |_ src/
 |   |__ commands/
 |   |__ configs/
 |   |__ handlers/
 |   |__ socket/
 |   |__ utils/
 |   |__ index.js
 |_ package.json
 |_ .env
 |_ README.md
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

## Beginner Rule
1. Every file should teach.
2. Not just work.
3. Every important function is explained.
4. Every module exists for a reason.
5. This project is designed to help beginners understand architecture, not just run commands.
Because understanding > copying. **Always**.
### Example
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

## Future Plans
- Welcome / Goodbye system
- Anti-link system
- Anti-spam system
- Economy system
- Plugin support
- Middleware system
- Advanced permissions
- Dashboard support
- Full database integration
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