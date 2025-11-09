import axios from 'axios';

export const command = {
    name: 'http',
    description: 'Get HTTP status dog: .http 404',
    execute: async (sock, msg, args, cmd, plug, react) => {
        if (args.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Provide a status code (e.g., 200, 404, 503).' });

        const code = args[0];
        await react("🐶");

        try {
            // Verify it's a real code by making a HEAD request first
            const imageUrl = `https://http.dog/${code}.jpg`;
            await axios.head(imageUrl);

            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: imageUrl },
                caption: `🐶 *HTTP ${code}*`
            }, { quoted: msg });
            await react("✅");

        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid HTTP status code.' });
        }
    }
};