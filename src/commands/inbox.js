import axios from 'axios';

// 🔴 PASTE YOUR KEY HERE AGAIN
const DIRECT_API_KEY = "WrkRp75WG3R1dRwcSTFd"; 

export const command = {
    name: 'inbox',
    description: 'Check inbox (temp-mail.io)',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .inbox <email>' });
        const email = args[0].trim();

        await react("📬");

        // Double check the key is there
        if (DIRECT_API_KEY === "PASTE_YOUR_KEY_HERE" || DIRECT_API_KEY === "") {
             await sock.sendMessage(msg.key.remoteJid, { text: '❌ You forgot to paste the API key into src/commands/inbox.js!' });
             return;
        }

        try {
            // Correct endpoint for temp-mail.io
            const url = `https://api.temp-mail.io/v1/emails/${email}/messages`;
            
            const { data } = await axios.get(url, {
                headers: { 'X-API-Key': DIRECT_API_KEY }
            });

            // Handle empty inbox
            if (!data.messages || data.messages.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '📭 Inbox is empty.' });
                await react("🤷");
                return;
            }

            // Get the newest message
            const latest = data.messages[0];
            
            const text = `📬 *LATEST EMAIL*\n\n` +
                         `👤 *From:* ${latest.from.name || latest.from.address}\n` +
                         `🏷️ *Subject:* ${latest.subject}\n` +
                         `⏰ *Time:* ${new Date(latest.created_at).toLocaleTimeString()}\n\n` +
                         `📄 *Body snippet:*\n${latest.body_text?.substring(0, 500) || '(No text preview)'}...`;

            await sock.sendMessage(msg.key.remoteJid, { text });
            await react("✅");

        } catch (e) {
            // Log the exact error from the server for debugging
            console.error("INBOX ERROR:", e.response?.data || e.message);
            
            if (e.response?.status === 401) {
                 await sock.sendMessage(msg.key.remoteJid, { text: '❌ Error: API Key is invalid.' });
            } else if (e.response?.status === 404) {
                 await sock.sendMessage(msg.key.remoteJid, { text: '❌ Error: Email address expired or not found.' });
            } else {
                 await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to check inbox. See console for details.' });
            }
            await react("❌");
        }
    }
};