🌟 NEXUS BOT ULTIMATE 🤖
The Next-Generation Multi-Session WhatsApp AutomatonA powerful, fully-featured, and multi-session WhatsApp userbot built on Baileys and Node.js.
Designed for power users, developers, and group administrators.
✨ KEY FEATURES
ModuleDescription🛰️ 
Multi-SessionRun-multiple WhatsApp numbers from a single bot instance.
🧠 Neural AIGemini-powered chat, image recognition (.ocr), and text analysis.
🛡️ Group SecurityAnti-delete, ViewOnce revealer, warn system, and mass-management tools.
💻 Dev ToolkitRemote code execution (.run), regex testing, and API tools.
🎉 Fun ZoneMemes, matchmaking (.ship), games, and AI-generated roasts.
⚙️ PREREQUISITES
Before you begin, ensure you have the following:

1. Node.js (v18 or higher)

2. Git

3. WhatsApp Account (linked via QR or Pairing Code)

🚀 DEPLOYMENT INSTRUCTIONS

📱 Option 1: Termux (Android)

Run these commands one by one in Termux:
# 1. Update system and install dependencies
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg libwebp -y
# 2. Fork the repository

# 3. Clone the repository
git clone https://github.com/YOUR_USERNAME/NEXUS_BOT_ULTIMATE.git
cd NEXUS_BOT_ULTIMATE

# 4. Install bot dependencies
npm install

# 5. Configure your keys (See Configuration section below)
nano src/index.js  # Use nano to edit your settings

# 6. Start the bot
npm start

💻 Option 2: PowerShell (Windows)

1. Install Node.js: Download and install from nodejs.org.

2. Open PowerShell in the folder where you want the bot.

3. Run these commands:
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

🛠️ CONFIGURATION
Open src/index.js and edit the configuration section at the top before running:

// 👇👇👇 IMPORTANT SETTINGS 👇👇👇
global.OWNER_ID = "2547XXXXXXXX@s.whatsapp.net"; // Your phone number
global.TEMP_MAIL_KEY = "YOUR_API_KEY_HERE";      // Get from temp-mail.io
global.GOOGLE_API_KEY = "YOUR_GEMINI_KEY";       // Get from Google AI Studio
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

🎮 USAGE
1. Run the bot.
2. Scan the QR code that appears in the terminal
3. .Type .menu in WhatsApp to see all commands!

AND VOILA!!!!
ENJOY MY NEXUS BOT ULTIMATE
SHARE TO YOUR FRIENDS AND DON'T FORGET TO FORK THE REPOSITORY
