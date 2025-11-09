import axios from 'axios';

export const command = {
    name: 'unshort',
    description: 'Reveal where a shortened link goes',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a shortened URL.' });

        let url = args[0];
        if (!url.startsWith('http')) url = 'http://' + url;

        await react("🕵️");

        try {
            // We make a request but tell axios NOT to automatically follow redirects,
            // so we can capture the first hop.
            const response = await axios.head(url, { 
                maxRedirects: 0, 
                validateStatus: (status) => status >= 200 && status < 400 
            });

            // If it's a redirect, the new location is in the headers
            const newUrl = response.headers.location;

            if (newUrl) {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `🔓 *Link Unshortened*\n\nOriginal: ${url}\ngoes to 👉 \`${newUrl}\`` 
                });
            } else {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ This link does not seem to be shortened (it goes nowhere else).' });
            }
            await react("✅");

        } catch (e) {
            // Sometimes axios throws an error on redirect if configured strictly, 
            // let's check if the error contains the redirect info.
            if (e.response && e.response.headers && e.response.headers.location) {
                 await sock.sendMessage(msg.key.remoteJid, { 
                    text: `🔓 *Link Unshortened*\n\n👉 \`${e.response.headers.location}\`` 
                });
                await react("✅");
            } else {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ Could not resolve link. It might be dead.' });
            }
        }
    }
};