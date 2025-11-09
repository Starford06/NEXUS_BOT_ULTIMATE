import axios from 'axios';

export const command = {
    name: 'short',
    description: 'Shorten a URL: .short https://very-long-url.com/xyz',
    execute: async (sock, msg, args) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Usage: .short <url>' });

        const urlToShorten = args[0];
        await sock.sendMessage(msg.key.remoteJid, { react: { text: "🔗", key: msg.key } });

        try {
            // TinyURL has a very simple plain-text API
            const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`);
            await sock.sendMessage(msg.key.remoteJid, { text: `✅ *Short Link:*\n${data}` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to shorten URL. Make sure it is valid.' });
        }
    }
};