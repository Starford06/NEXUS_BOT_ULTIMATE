Module,Description
🛰️ Multi-Session,Run multiple WhatsApp numbers from a single bot instance.
🖥️ Cyber Dashboard,Real-time web control panel for managing sessions and logs.
🧠 Neural AI,"Gemini-powered chat, image recognition (.ocr), and text analysis."
🛡️ Group Security,"Anti-delete, ViewOnce revealer, warn system, and mass-management tools."
💻 Dev Toolkit,"Remote code execution (.run), regex testing, and API tools."
🎉 Fun Zone,"Memes, matchmaking (.ship), games, and AI-generated roasts."
⚙️ PREREQUISITES
Before you begin, ensure you have the following:

Node.js (v18 or higher)

Git

WhatsApp Account (linked via QR or Pairing Code)

🚀 DEPLOYMENT INSTRUCTIONS
📱 Option 1: Termux (Android)
Run these commands one by one in Termux:

Bash

# 1. Update system and install dependencies
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg libwebp -y

# 2. Clone the repository
git clone https://github.com/YOUR_USERNAME/NEXUS_BOT_ULTIMATE.git
cd NEXUS_BOT_ULTIMATE

# 3. Install bot dependencies
npm install

# 4. Configure your keys (See Configuration section below)
nano src/index.js  # Use nano to edit your settings

# 5. Start the bot
npm start
💻 Option 2: PowerShell (Windows)
Install Node.js: Download and install from nodejs.org.

Open PowerShell in the folder where you want the bot.

Run these commands:

PowerShell

# 1. Clone the repo (or download ZIP and extract)
git clone https://github.com/YOUR_USERNAME/NEXUS_BOT_ULTIMATE.git
cd NEXUS_BOT_ULTIMATE

# 2. Install dependencies
npm install

# 3. (Optional) Create a quick-start batch file
echo "@echo off" > start.bat
echo "node src/index.js" >> start.bat
echo "pause" >> start.bat

# 4. Start the bot
.\start.bat
