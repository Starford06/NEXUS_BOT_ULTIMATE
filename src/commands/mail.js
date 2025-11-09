import axios from 'axios';

// 🔴 PASTE YOUR KEY RIGHT HERE INSIDE THE QUOTES
const DIRECT_API_KEY = "WrkRp75WG3R1dRwcSTFd"; 
export const command = {
    name: 'mail',
    description: 'Debug Temp Mail (Direct Key)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        await react("🔍");
        
        if (DIRECT_API_KEY === "PASTE_YOUR_KEY_HERE" || DIRECT_API_KEY === "") {
             await sock.sendMessage(msg.key.remoteJid, { text: '❌ You forgot to paste the key into the file!' });
             return;
        }

        try {
            const response = await axios.post('https://api.temp-mail.io/v1/emails', {}, {
                headers: { 'X-API-Key': DIRECT_API_KEY }
            });

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `✅ *It Worked!* \n\nEmail: \`${response.data.email}\`\n\n*Now, move your key back to src/index.js to keep it safe.*` 
            });
            await react("✅");

        } catch (e) {
            console.error("DIRECT TEST ERROR:", e.response?.data || e.message);
             await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ Still failing: ${e.response?.status || 'Unknown Error'} (See console)` 
            });
        }
    }
};